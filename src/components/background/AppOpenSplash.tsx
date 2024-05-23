import { Dimensions } from "react-native";
import { Image } from "expo-image";

import { randomChoice } from "@utils/Utils";

export const localSplashes = [
  () => require("@assets/splash/steria2.jpg"),
  () => require("@assets/splash/abu-10k-subs.gif"),
  () => require("@assets/splash/nox-3d.png"),
];
const randomSplashes = randomChoice(localSplashes);

const style = {
  flex: 1,
  height: Dimensions.get("window").height,
  width: Dimensions.get("window").width,
};

const AppOpenSplash = () => (
  <Image source={randomSplashes()} style={style} resizeMode={"contain"} />
);

export default AppOpenSplash;
