import React from "react";
import TrackPlayer from "react-native-track-player";

import GenericDialog from "@components/dialogs/GenericDialog";
import showLog from "./Log";
import { useNoxSetting } from "@stores/useApp";

export default () => {
  const [visible] = React.useState(false);
  return <GenericDialog visible={visible}></GenericDialog>;
};

export const showDebugLog = async () => {
  const log = `TP.volume: ${await TrackPlayer.getVolume()}\n
    TP.activeTrack: ${JSON.stringify(await TrackPlayer.getActiveTrack())}\n
    playerStyle: ${JSON.stringify(useNoxSetting.getState().playerStyle)}`;
  showLog(log);
};
