import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import Page from "./components/Page";

const WORDS = ["What's", "up", "mobile", "udev?"];

export default function App() {
  const translateX = useSharedValue<number>(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    translateX.value = event.contentOffset.x;
  });

  return (
    <Animated.ScrollView
      horizontal
      style={styles.container}
      onScroll={scrollHandler}
      scrollEventThrottle={16} // 1000/16 = 60 which is like 60Hz animation
      // snapToInterval={Dimensions.get("window").width}
    >
      {WORDS.map((title, index) => (
        <Page key={title} {...{ index, title }} translateX={translateX} />
      ))}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
