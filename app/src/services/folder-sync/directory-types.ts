export interface SyncDirectory {
  list(): Promise<string[]>;
  read(name: string): Promise<string | undefined>;
  write(name: string, content: string, expectedContent: string | undefined): Promise<void>;
  archive(name: string, content: string): Promise<void>;
  /** Removes a resolved conflict from the scan, retaining its contents in the archive. */
  remove(name: string, expectedContent: string): Promise<void>;
}

export interface SyncDirectories {
  pick(): Promise<string | undefined>;
  open(uri: string): SyncDirectory;
}
