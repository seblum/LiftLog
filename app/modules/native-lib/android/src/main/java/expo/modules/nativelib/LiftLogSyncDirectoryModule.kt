package expo.modules.nativelib

import android.content.ContentResolver
import android.net.Uri
import android.provider.DocumentsContract
import android.provider.DocumentsContract.Document
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.ByteArrayOutputStream
import java.io.FileNotFoundException
import java.io.IOException
import java.nio.ByteBuffer
import java.nio.charset.CodingErrorAction
import java.util.UUID

/** SAF document IDs are opaque: filenames must come from COLUMN_DISPLAY_NAME, never URI paths. */
class LiftLogSyncDirectoryModule : Module() {
    private val lock = Any()

    override fun definition() = ModuleDefinition {
        Name("LiftLogSyncDirectory")

        AsyncFunction("list") { treeUri: String ->
            withDirectory(treeUri) { it.list() }
        }
        AsyncFunction("read") { treeUri: String, name: String ->
            withDirectory(treeUri) { it.read(name) }
        }
        AsyncFunction("write") { treeUri: String, name: String, content: String, expected: String? ->
            withDirectory(treeUri) { it.write(name, content, expected) }
        }
        AsyncFunction("archive") { treeUri: String, name: String, content: String ->
            withDirectory(treeUri) { it.archive(name, content) }
        }
        AsyncFunction("remove") { treeUri: String, name: String, expected: String ->
            withDirectory(treeUri) { it.remove(name, expected) }
        }
    }

    private fun <T> withDirectory(treeUri: String, block: (SyncDocuments) -> T): T = synchronized(lock) {
        val resolver = appContext.reactContext?.contentResolver
            ?: throw IllegalStateException("Android storage is not ready. Reopen LiftLog and try again.")
        try {
            block(SyncDocuments(resolver, Uri.parse(treeUri)))
        } catch (error: SecurityException) {
            throw IOException("Access to the shared folder was lost. Reconnect it in Folder sync.", error)
        } catch (error: FileNotFoundException) {
            throw IOException("The shared folder or a file is unavailable. Check storage and try syncing again.", error)
        }
    }
}

private class SyncDocuments(private val resolver: ContentResolver, private val tree: Uri) {
    companion object {
        private const val MAX_BYTES = 10 * 1024 * 1024
        private const val PENDING = ".ll-p-"
        private const val RECOVERY = ".ll-r-"
        private const val HISTORY = ".ll-h-"
        private const val ARCHIVES = ".liftlog-archives"
        private val recoveryPattern = Regex("^\\.ll-r-([0-9a-f]{32})--(.+)$")
        private val pendingPattern = Regex("^\\.ll-p-([0-9a-f]{32})--((?:session|program|exercise|exercise-visibility)--.+\\.json)$")
    }

    private data class Entry(val uri: Uri, val name: String, val directory: Boolean, val size: Long?)

    private val root: Uri

    init {
        require(tree.scheme == "content" && DocumentsContract.isTreeUri(tree)) {
            "Choose a folder in Android's system folder picker."
        }
        root = DocumentsContract.buildDocumentUriUsingTree(tree, DocumentsContract.getTreeDocumentId(tree))
    }

    fun list(): List<String> {
        recoverInterruptedWrites()
        val entries = children(root)
        requireUniqueNames(entries)
        return entries.filterNot { it.directory }.map { it.name }
    }

    fun read(name: String): String? {
        validateName(name)
        recoverInterruptedWrites()
        return find(root, name)?.let { readEntry(it) }
    }

    fun write(name: String, content: String, expected: String?) {
        validateName(name)
        val bytes = encode(content)
        recoverInterruptedWrites()
        val original = find(root, name)
        checkExpected(name, original, expected)
        if (expected == content) return

        val transaction = transactionId()
        val stage = createFile(root, "$PENDING$transaction--$name", bytes)
        // Staging may take time on a provider. Compare again before moving any existing document.
        val current = find(root, name)
        checkExpected(name, current, expected)
        if (original?.uri != current?.uri) changed(name)

        var recovery: Entry? = null
        if (current != null) {
            recovery = rename(current, "$RECOVERY$transaction--$name")
            // Preserve the original document itself. A writer with an open descriptor still writes
            // into this recoverable file; no existing file is truncated or deleted by LiftLog.
            if (readEntry(recovery) != expected) changed(name)
        }

        if (find(root, name) != null) changed(name)
        val published = rename(stage, name)
        val latest = find(root, name)
        if (latest?.uri != published.uri || readEntry(published) != content) changed(name)
        if (recovery != null) {
            // Check once more after publication. The original remains in history even on a race.
            val changedDuringPublication = readEntry(recovery) != expected
            val preserved = rename(recovery, if (changedDuringPublication) conflictName(name, transaction) else "$HISTORY$transaction--$name")
            if (changedDuringPublication) changed(name)
            if (readEntry(preserved) != expected) {
                rename(preserved, conflictName(name, transactionId()))
                changed(name)
            }
        }
    }

    fun archive(name: String, content: String) {
        validateName(name)
        val bytes = encode(content)
        val archives = getOrCreateDirectory(root, ARCHIVES)
        val transaction = getOrCreateDirectory(archives.uri, transactionId())
        createFile(transaction.uri, name, bytes)
    }

    /** Retire a reviewed Syncthing conflict copy without unlinking its last version. */
    fun remove(name: String, expected: String) {
        validateName(name)
        val canonical = name.replace(Regex("\\.sync-conflict-[^.]+(?=\\.json$)"), "")
        require(canonical != name && Regex("^(session|program|exercise|exercise-visibility)--.+\\.json$").matches(canonical)) {
            "Only a reviewed conflict copy can be retired from the shared folder."
        }
        recoverInterruptedWrites()
        val entry = find(root, name)
        checkExpected(name, entry, expected)
        requireNotNull(entry)
        archive(name, expected)
        val current = find(root, name)
        checkExpected(name, current, expected)
        val transaction = transactionId()
        // Keep the document discoverable as a conflict until both the comparison and rename have
        // completed. A process stop or detected racing edit must not hide it in ignored history.
        val retiring = rename(requireNotNull(current), conflictName(canonical, transaction))
        if (readEntry(retiring) != expected || find(root, name) != null) changed(name)
        val archived = rename(retiring, "$HISTORY$transaction--$canonical")
        if (readEntry(archived) != expected) {
            rename(archived, conflictName(canonical, transactionId()))
            changed(name)
        }
        if (find(root, name) != null) changed(name)
    }

    /** A stopped app never leaves a vanished canonical record that looks like an intentional edit. */
    private fun recoverInterruptedWrites() {
        val recoveries = children(root).mapNotNull { entry ->
            val match = recoveryPattern.matchEntire(entry.name)
            if (match == null || entry.directory) null else Triple(entry, match.groupValues[1], match.groupValues[2])
        }
        val ambiguous = recoveries.groupBy { it.third }.entries.firstOrNull { it.value.size > 1 }
        if (ambiguous != null) {
            throw IOException("Multiple interrupted writes exist for ${ambiguous.key}. All versions were preserved; review the .ll-r files before syncing again.")
        }
        for ((entry, transaction, name) in recoveries) {
            validateName(name)
            if (find(root, name) == null) {
                rename(entry, name)
            } else {
                // Publication may have completed before the app stopped. We cannot establish
                // whether the old file changed in that interval, so require an explicit review.
                rename(entry, conflictName(name, transaction))
            }
        }
        // A newly authored record can be staged before its queued SQLite write is durable. Keep
        // orphan stages visible for review even without a previous file to restore. Partially
        // written stages remain visible as invalid files; they never replace a canonical record.
        for (entry in children(root)) {
            if (entry.directory) continue
            val match = pendingPattern.matchEntire(entry.name) ?: continue
            rename(entry, conflictName(match.groupValues[2], transactionId()))
        }
    }

    private fun children(parent: Uri): List<Entry> {
        val childUri = DocumentsContract.buildChildDocumentsUriUsingTree(tree, DocumentsContract.getDocumentId(parent))
        val projection = arrayOf(Document.COLUMN_DOCUMENT_ID, Document.COLUMN_DISPLAY_NAME, Document.COLUMN_MIME_TYPE, Document.COLUMN_SIZE)
        val cursor = resolver.query(childUri, projection, null, null, null)
            ?: throw IOException("The storage provider could not list the shared folder.")
        return cursor.use {
            val entries = mutableListOf<Entry>()
            while (it.moveToNext()) {
                val id = it.getString(0) ?: throw IOException("The storage provider returned an invalid document ID.")
                val name = it.getString(1) ?: throw IOException("The storage provider returned a file without a name.")
                entries.add(Entry(
                    DocumentsContract.buildDocumentUriUsingTree(tree, id),
                    name,
                    it.getString(2) == Document.MIME_TYPE_DIR,
                    if (it.isNull(3)) null else it.getLong(3)
                ))
            }
            entries
        }
    }

    private fun find(parent: Uri, name: String): Entry? {
        val matches = children(parent).filter { it.name == name }
        if (matches.size > 1) throw IOException("The shared folder contains more than one file named $name. Rename the duplicate before syncing.")
        return matches.singleOrNull()
    }

    private fun requireUniqueNames(entries: List<Entry>) {
        val duplicate = entries.groupBy { it.name }.entries.firstOrNull { it.value.size > 1 }
        if (duplicate != null) throw IOException("The shared folder contains more than one file named ${duplicate.key}. Rename the duplicate before syncing.")
    }

    private fun readEntry(entry: Entry): String {
        if (entry.directory) throw IOException("${entry.name} is a folder, not a sync file.")
        if (entry.size != null && entry.size > MAX_BYTES) throw IOException("${entry.name} exceeds the 10 MiB sync file limit.")
        val input = resolver.openInputStream(entry.uri)
            ?: throw IOException("The storage provider could not open ${entry.name}.")
        val bytes = input.use { stream ->
            val output = ByteArrayOutputStream()
            val buffer = ByteArray(8192)
            var total = 0
            while (true) {
                val count = stream.read(buffer)
                if (count < 0) break
                total += count
                if (total > MAX_BYTES) throw IOException("${entry.name} exceeds the 10 MiB sync file limit.")
                output.write(buffer, 0, count)
            }
            output.toByteArray()
        }
        try {
            return Charsets.UTF_8.newDecoder()
                .onMalformedInput(CodingErrorAction.REPORT)
                .onUnmappableCharacter(CodingErrorAction.REPORT)
                .decode(ByteBuffer.wrap(bytes)).toString()
        } catch (error: java.nio.charset.CharacterCodingException) {
            throw IOException("${entry.name} is not valid UTF-8 text. Save it as UTF-8 and retry.", error)
        }
    }

    private fun createFile(parent: Uri, name: String, bytes: ByteArray): Entry {
        validateName(name)
        if (find(parent, name) != null) changed(name)
        val mime = if (name.endsWith(".json")) "application/json" else "application/octet-stream"
        val uri = DocumentsContract.createDocument(resolver, parent, mime, name)
            ?: throw IOException("The storage provider could not create $name.")
        val created = queryEntry(uri)
        if (created.name != name || find(parent, name)?.uri != uri) {
            throw IOException("The storage provider changed the requested filename $name. Sync stopped to preserve existing files.")
        }
        // Only newly created, uniquely named staging/archive files are opened for writing.
        resolver.openOutputStream(uri, "wt")?.use { output ->
            output.write(bytes)
            output.flush()
        } ?: throw IOException("The storage provider could not write $name.")
        if (!readEntry(queryEntry(uri)).toByteArray(Charsets.UTF_8).contentEquals(bytes)) {
            throw IOException("The storage provider did not preserve the complete contents of $name.")
        }
        return queryEntry(uri)
    }

    private fun getOrCreateDirectory(parent: Uri, name: String): Entry {
        val existing = find(parent, name)
        if (existing != null) {
            if (!existing.directory) throw IOException("$name must be a folder.")
            return existing
        }
        val uri = DocumentsContract.createDocument(resolver, parent, Document.MIME_TYPE_DIR, name)
            ?: throw IOException("The storage provider could not create the sync archive folder.")
        val created = queryEntry(uri)
        if (!created.directory || created.name != name || find(parent, name)?.uri != uri) {
            throw IOException("The storage provider could not create a uniquely named sync archive folder.")
        }
        return created
    }

    private fun rename(entry: Entry, name: String): Entry {
        validateName(name)
        if (find(root, name) != null) changed(name)
        val uri = DocumentsContract.renameDocument(resolver, entry.uri, name)
            ?: throw IOException("The storage provider does not support safe renaming. Choose a local folder on your phone.")
        val renamed = queryEntry(uri)
        if (renamed.name != name || find(root, name)?.uri != uri) {
            throw IOException("Another file appeared while publishing $name. All staged versions were preserved; sync again after reviewing the folder.")
        }
        return renamed
    }

    private fun queryEntry(uri: Uri): Entry {
        val projection = arrayOf(Document.COLUMN_DISPLAY_NAME, Document.COLUMN_MIME_TYPE, Document.COLUMN_SIZE)
        val cursor = resolver.query(uri, projection, null, null, null)
            ?: throw IOException("The storage provider could not inspect a sync file.")
        return cursor.use {
            if (!it.moveToFirst()) throw FileNotFoundException("A sync file disappeared during the operation.")
            Entry(uri, it.getString(0), it.getString(1) == Document.MIME_TYPE_DIR, if (it.isNull(2)) null else it.getLong(2))
        }
    }

    private fun checkExpected(name: String, entry: Entry?, expected: String?) {
        if (entry?.let { readEntry(it) } != expected) changed(name)
    }

    private fun changed(name: String): Nothing = throw IOException("$name changed during sync. Existing versions were preserved; sync again to review the latest changes.")

    private fun encode(content: String): ByteArray {
        val bytes = content.toByteArray(Charsets.UTF_8)
        if (bytes.size > MAX_BYTES) throw IOException("The content exceeds the 10 MiB sync file limit.")
        return bytes
    }

    private fun validateName(name: String) {
        require(name.isNotEmpty() && name != "." && name != ".." &&
            !name.any { it == '/' || it == '\\' || it.code < 32 || it.code == 127 } &&
            name.toByteArray(Charsets.UTF_8).size <= 255) {
            "The sync filename is invalid or exceeds 255 bytes. Shorten the record ID."
        }
    }

    private fun transactionId(): String = UUID.randomUUID().toString().replace("-", "")

    private fun conflictName(name: String, transaction: String): String =
        if (Regex("^(session|program|exercise|exercise-visibility)--.+\\.json$").matches(name)) {
            "${name.removeSuffix(".json")}.sync-conflict-$transaction.json"
        } else {
            "$HISTORY$transaction--$name"
        }
}
