import SpInAppUpdates, {
  IAUUpdateKind,
  StartUpdateOptions,
} from "sp-react-native-in-app-updates";
import { Platform } from "react-native";

// eslint-disable-next-line import/no-unresolved
import { APPSTORE } from "@env";
import logger from "@utils/Logger";

export default () => {
  const inAppUpdates = new SpInAppUpdates(
    false, // isDebug
  );

  const checkPlayStoreUpdates = async () => {
    if (Platform.OS !== "android" || !APPSTORE) return;
    try {
      // curVersion is optional if you don't provide it will automatically take from the app using react-native-device-info
      const result = await inAppUpdates.checkNeedsUpdate();
      if (result.shouldUpdate) {
        let updateOptions: StartUpdateOptions = {};
        if (Platform.OS === "android") {
          // android only, on iOS the user will be promped to go to your app store page
          updateOptions = {
            updateType: IAUUpdateKind.FLEXIBLE,
          };
        }
        inAppUpdates.startUpdate(updateOptions); // https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78
      }
    } catch {
      logger.error("[PlayStore] checkPlayStoreUpdates failed");
    }
  };

  return { checkPlayStoreUpdates };
};
