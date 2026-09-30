import { createAction } from '@reduxjs/toolkit';
import type { SyncRecord } from '@/models/folder-sync';

/** Content from the shared folder; deliberately does not run workout-completion integrations. */
export const applyFolderSyncRecord = createAction<SyncRecord>('folderSync/applyRecord');
