import React, { useState, useEffect } from "react";
import TrackPlayer, {
  Event,
  useTrackPlayerEvents,
} from "react-native-track-player";
import { useStore } from "zustand";

import { useNoxSetting } from "@stores/useApp";
import { updatePlaylistSongs } from "@utils/playlistOperations";
import LottieButtonAnimated from "@components/buttons/LottieButtonAnimated";
import appStore from "@stores/appStore";
import { Platform } from "react-native";
import logger from "@utils/Logger";

const getAppStoreState = appStore.getState;

export default ({ track }: NoxComponent.TrackProps) => {
  const song = track?.song as NoxMedia.Song;
  const favoritePlaylist = useNoxSetting((state) => state.favoritePlaylist);
  const setFavoritePlaylist = useNoxSetting(
    (state) => state.setFavoritePlaylist,
  );
  const [liked, setLiked] = useState(
    favoritePlaylist.songList.filter((val) => val.id === song?.id).length > 0,
  );
  const setRNTPOptions = useStore(appStore, (state) => state.setRNTPOptions);

  const onClick = () => {
    if (!song) return;
    if (liked) {
      setFavoritePlaylist(updatePlaylistSongs(favoritePlaylist, [], [song]));
    } else {
      setFavoritePlaylist(updatePlaylistSongs(favoritePlaylist, [song], []));
    }
    setLiked(!liked);
    setHeart(!liked);
  };

  const setHeart = (heart = false) => {
    if (Platform.OS === "android") {
      const newRNTPOptions = {
        ...getAppStoreState().RNTPOptions,
        forwardIcon: heart ? 1 : 0,
      };
      TrackPlayer.updateOptions(newRNTPOptions);
      setRNTPOptions(newRNTPOptions);
    }
  };

  useTrackPlayerEvents([Event.RemoteJumpForward], () => {
    logger.log("[Event.RemoteJumpForward] button pressed.");
    onClick();
  });

  useEffect(() => {
    const liked =
      favoritePlaylist.songList.filter((val) => val.id === song?.id).length > 0;
    setHeart(liked);
    setLiked(liked);
  }, [track]);

  return (
    <LottieButtonAnimated
      src={require("@assets/lottie/Heart.json")}
      size={30}
      onPress={onClick}
      clicked={liked}
      clickedLottieProgress={0.5}
      strokes={["Rays 2", "Fill 2", "Heart Outlines 2"]}
      duration={500}
      pressableStyle={{ backgroundColor: undefined }}
    />
  );
};
