import { Dimensions, StyleSheet } from "react-native";
// @ts-expect-error
import SimpleImage from "./img.jpg";
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function App() {
  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const pinchHandler =
    useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
      onActive: (event) => {
        scale.value = event.scale;
        focalX.value = event.focalX;
        focalY.value = event.focalY;
      },
      onEnd: () => {
        scale.value = withTiming(1);
      },
    });

  const dImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        // Translate the image to focal point
        { translateX: focalX.value },
        { translateY: focalY.value },
        // Translate the image such that the center of the image is in focal point
        { translateX: -width / 2 },
        { translateY: -height / 2 },
        // Scale the image after these 2 above happens
        { scale: scale.value },
        // Removing applied translate to focus on user intended place
        { translateX: -focalX.value },
        { translateY: -focalY.value },
        // Remove the centering image to show full image
        { translateX: width / 2 },
        { translateY: height / 2 },
      ],
    };
  });

  const dFocalPointStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: focalX.value }, { translateY: focalY.value }],
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <PinchGestureHandler onGestureEvent={pinchHandler}>
        <Animated.View style={{ flex: 1 }}>
          <Animated.Image
            source={SimpleImage}
            style={[{ flex: 1 }, dImageStyle]}
          />
          <Animated.View style={[styles.focalPoint, dFocalPointStyle]} />
        </Animated.View>
      </PinchGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  focalPoint: {
    ...StyleSheet.absoluteFillObject,
    width: 20,
    height: 20,
    backgroundColor: "blue",
    borderRadius: 10,
  },
});
