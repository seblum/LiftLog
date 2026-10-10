import { NativeModule, requireNativeModule } from 'expo';
import { Platform } from 'react-native';

declare class ReactNativeSyncDirectoryModule extends NativeModule {
  list(treeUri: string): Promise<string[]>;
  read(treeUri: string, name: string): Promise<string | null>;
  write(treeUri: string, name: string, content: string, expectedContent: string | null): Promise<void>;
  archive(treeUri: string, name: string, content: string): Promise<void>;
  remove(treeUri: string, name: string, expectedContent: string): Promise<void>;
}

export function getSyncDirectoryModule(): ReactNativeSyncDirectoryModule {
  if (Platform.OS !== 'android') throw new Error('Folder sync is currently available on Android only.');
  return requireNativeModule<ReactNativeSyncDirectoryModule>('LiftLogSyncDirectory');
}
