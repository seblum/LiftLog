import { Directory } from 'expo-file-system';
import { Platform } from 'react-native';
import { getSyncDirectoryModule } from '~/modules/native-lib/src/ReactNativeSyncDirectoryModule';
import type { SyncDirectory } from './directory-types';

/** Android's persistent tree grant is obtained by Expo's system directory picker. */
export class AndroidSyncDirectory implements SyncDirectory {
  constructor(private readonly uri: string) {}

  static async pick(): Promise<string | undefined> {
    if (Platform.OS !== 'android') throw new Error('Folder sync is currently available on Android only.');
    try {
      return (await Directory.pickDirectoryAsync()).uri;
    } catch (error) {
      // Expo reports cancellation as ERR_PICKER_CANCELLED; permission/provider errors must surface.
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ERR_PICKER_CANCELLED') {
        return undefined;
      }
      throw error;
    }
  }

  list(): Promise<string[]> {
    return getSyncDirectoryModule().list(this.uri);
  }

  async read(name: string): Promise<string | undefined> {
    return (await getSyncDirectoryModule().read(this.uri, name)) ?? undefined;
  }

  write(name: string, content: string, expectedContent: string | undefined): Promise<void> {
    return getSyncDirectoryModule().write(this.uri, name, content, expectedContent ?? null);
  }

  archive(name: string, content: string): Promise<void> {
    return getSyncDirectoryModule().archive(this.uri, name, content);
  }

  remove(name: string, expectedContent: string): Promise<void> {
    return getSyncDirectoryModule().remove(this.uri, name, expectedContent);
  }
}
