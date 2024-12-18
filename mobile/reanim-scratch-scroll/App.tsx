import { Dimensions, StyleSheet } from "react-native";
import Page from "./components/Page";
import {
  PanGestureHandler,
  GestureHandlerRootView,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  withDecay,
  useDerivedValue,
  cancelAnimation,
} from "react-native-reanimated";

const WORDS = ["What's", "up", "mobile", "udev?"];
const { width: PAGE_WIDTH } = Dimensions.get("window");
const MAX_TRANSLATE_X = -(PAGE_WIDTH * (WORDS.length - 1));

export default function App() {
  const translateX = useSharedValue(0);
  const pTranslateX = useSharedValue(0);

  const clampedTranslateX = useDerivedValue(() => {
    const limitedMinTranslateX = Math.min(translateX.value, 0);
    const limitedMaxTranslateX = Math.max(
      limitedMinTranslateX,
      MAX_TRANSLATE_X
    );
    // We trimmed both min and max after this
    return limitedMaxTranslateX;
  });

  const panHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: (_) => {
      // pTranslateX.value = translateX.value;
      pTranslateX.value = clampedTranslateX.value;

      // We need to stop withDecay animation to make it smooth when user try to scroll and stop faster
      cancelAnimation(translateX);
    },
    onActive: (event) => {
      translateX.value = event.translationX + pTranslateX.value;
    },
    onEnd: (event) => {
      // When scrolling ends, end with some delay
      translateX.value = withDecay({ velocity: event.velocityX });
    },
  });

  return (
    <GestureHandlerRootView>
      <PanGestureHandler onGestureEvent={panHandler}>
        <Animated.View style={styles.container}>
          {WORDS.map((title, index) => {
            return (
              <Page
                key={title}
                index={index}
                title={title}
                // translateX={translateX}
                translateX={clampedTranslateX}
              />
            );
          })}
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
});
