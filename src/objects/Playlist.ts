import { v4 as uuidv4 } from "uuid";
import i18n from "i18next";

import { PlaylistTypes } from "../enums/Playlist";

export const dummyPlaylist = (
  title = i18n.t("PlaylistOperations.searchListName"),
  type = PlaylistTypes.Typical,
): NoxMedia.Playlist => {
  return {
    songList: [],
    title,
    id: uuidv4(),
    subscribeUrl: [],
    blacklistedUrl: [],
    useBiliShazam: false,
    lastSubscribed: 0,
    type,
    biliSync: false,
    newSongOverwrite: false,
  };
};

export const dummyPlaylistList = dummyPlaylist();

export const getPlaylistUniqBVIDs = (playlist: NoxMedia.Playlist) => {
  return Array.from(
    playlist.songList.reduce(
      (accumulator, currentValue) => accumulator.add(currentValue.bvid),
      new Set() as Set<string>,
    ),
  );
};
