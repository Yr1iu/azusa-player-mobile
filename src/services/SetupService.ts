import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
} from 'react-native-track-player';
import { Event } from 'react-native-track-player';

import type { NoxStorage } from '../types/storage';

const setupPlayer = async (
  options: Parameters<typeof TrackPlayer.setupPlayer>[0]
) => {
  const setup = async () => {
    try {
      await TrackPlayer.setupPlayer(options);
    } catch (error) {
      return (error as Error & { code?: string }).code;
    }
  };
  while ((await setup()) === 'android_cannot_setup_player_in_background') {
    // A timeout will mostly only execute when the app is in the foreground,
    // and even if we were in the background still, it will reject the promise
    // and we'll try again:
    await new Promise<void>(resolve => setTimeout(resolve, 1));
  }
};

export const SetupService = async ({
  noInterruption = false,
}: Partial<NoxStorage.PlayerSettingDict>) => {
  await setupPlayer({
    autoHandleInterruptions: noInterruption ? false : true,
    maxCacheSize: 1024 * 100,
  });
  await TrackPlayer.updateOptions({
    android: {
      appKilledPlaybackBehavior:
        AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
    },
    // This flag is now deprecated. Please use the above to define playback mode.
    // stoppingAppPausesPlayback: true,
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.SeekTo,
    ],
    compactCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
    ],
    progressUpdateEventInterval: 2,
  });
  await TrackPlayer.setRepeatMode(RepeatMode.Off);
};
