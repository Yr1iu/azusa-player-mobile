import { logger } from "@utils/Logger";
import { readTxtFile, writeTxtFile } from "@utils/fs";
import useLyric from "./useLyric";
import { LrcSource } from "@enums/LyricFetch";

const LYRIC_OFFSET_INTERVAL = 0.5;

export default (currentSong?: NoxMedia.Song, artist = "") => {
  const usedLyric = useLyric(currentSong);

  const updateLyricMapping = ({
    resolvedLrc,
    newLrcDetail = {},
    lrc,
    song,
    currentTimeOffset,
  }: {
    resolvedLrc?: NoxNetwork.NoxFetchedLyric;
    newLrcDetail?: Partial<NoxMedia.LyricDetail>;
    lrc: string;
    song: NoxMedia.Song;
    currentTimeOffset: number;
  }) => {
    if (resolvedLrc) {
      const lrcpath = `${song.id}.txt`;
      writeTxtFile(lrcpath, [newLrcDetail.lyric || lrc], "lrc/");
      const lyricDeatail: NoxMedia.LyricDetail = {
        songId: song.id,
        lyricKey: resolvedLrc.key,
        lyricOffset: currentTimeOffset,
        ...newLrcDetail,
        lyric: lrcpath,
        source: resolvedLrc.source,
      };
      usedLyric.setLyricMapping(lyricDeatail);
    }
  };

  const getLrcFromLocal = async (song?: NoxMedia.Song) => {
    const lrcDetail = usedLyric.getLrcFromLocal(song);
    if (lrcDetail === undefined) return;
    let localLrc: string | undefined = undefined;
    if (lrcDetail.lyric.endsWith(".txt")) {
      localLrc = await readTxtFile(lrcDetail.lyric, "lrc/");
      if (localLrc) {
        logger.debug("[lrc] read local lrc and loading...");
      }
    } else {
      logger.debug(
        "[lrc] local lrc seems to be the content itself, loading that...",
      );
      localLrc = lrcDetail.lyric;
    }
    return {
      lrcDetail,
      localLrc,
    };
  };

  const searchAndSetCurrentLyric = (
    index = 0,
    resolvedLrcOptions = usedLyric.lrcOptions,
    resolvedLyric?: NoxMedia.LyricDetail,
    song = currentSong,
  ) =>
    usedLyric.searchAndSetCurrentLyric(
      updateLyricMapping,
      index,
      resolvedLrcOptions,
      resolvedLyric,
      song,
    );

  const loadLocalLrc = async (
    lyricPromise: Promise<NoxNetwork.NoxFetchedLyric[]>,
  ) => {
    const localLrcColle = getLrcFromLocal(currentSong);
    return usedLyric.loadLocalLrc(getLrcFromLocal(currentSong), async () =>
      searchAndSetCurrentLyric(
        undefined,
        await lyricPromise,
        (await localLrcColle)?.lrcDetail,
      ),
    );
  };

  const fetchAndSetLyricOptions = (adhocTitle = currentSong?.name) =>
    usedLyric.fetchAndSetLyricOptions(
      adhocTitle,
      [LrcSource.QQQrc, LrcSource.QQ, LrcSource.BiliBili, LrcSource.Kugou],
      artist,
      (options) => {
        options[0].length !== 1 && options.push(options.shift()!);
      },
    );

  const addSubtractOffset = (isAdd: boolean) => {
    const newTimeOffset = isAdd
      ? usedLyric.currentTimeOffset + LYRIC_OFFSET_INTERVAL
      : usedLyric.currentTimeOffset - LYRIC_OFFSET_INTERVAL;
    usedLyric.setCurrentTimeOffset(newTimeOffset);
    updateLyricMapping({
      resolvedLrc: usedLyric.lrcOption,
      newLrcDetail: { lyricOffset: newTimeOffset },
      lrc: usedLyric.lrc,
      song: currentSong!,
      currentTimeOffset: newTimeOffset,
    });
  };

  const initTrackLrcLoad = () =>
    usedLyric.initTrackLrcLoad(
      fetchAndSetLyricOptions,
      loadLocalLrc,
      searchAndSetCurrentLyric,
    );

  return {
    ...usedLyric,
    searchAndSetCurrentLyric,
    fetchAndSetLyricOptions,
    addSubtractOffset,
    initTrackLrcLoad,
  };
};
