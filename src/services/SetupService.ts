import TrackPlayer, {
  RepeatMode,
  IOSCategoryOptions,
} from "react-native-track-player";

import { initRNTPOptions } from "../utils/RNTPUtils";
import appStore from "@stores/appStore";

const { setState } = appStore;

const setupPlayer = async (
  options: Parameters<typeof TrackPlayer.setupPlayer>[0],
) => {
  const setup = async () => {
    try {
      await TrackPlayer.setupPlayer(options);
    } catch (error) {
      return (error as Error & { code?: string }).code;
    }
  };
  while ((await setup()) === "android_cannot_setup_player_in_background") {
    // A timeout will mostly only execute when the app is in the foreground,
    // and even if we were in the background still, it will reject the promise
    // and we'll try again:
    await new Promise<void>((resolve) => setTimeout(resolve, 1));
  }
};

export const SetupService = async ({
  noInterruption = false,
  keepForeground = false,
}: Partial<NoxStorage.PlayerSettingDict>) => {
  await setupPlayer({
    autoHandleInterruptions: noInterruption ? false : true,
    maxCacheSize: 1024 * 100,
    iosCategoryOptions: [
      IOSCategoryOptions.AllowAirPlay,
      IOSCategoryOptions.AllowBluetooth,
      IOSCategoryOptions.AllowBluetoothA2DP,
    ],
  });
  const RNTPOptions = initRNTPOptions({ keepForeground });
  setState({ RNTPOptions });
  await TrackPlayer.updateOptions(RNTPOptions);
  await TrackPlayer.setRepeatMode(RepeatMode.Off);
};
