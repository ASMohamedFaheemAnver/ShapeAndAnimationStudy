import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const SIZE = 100;
const CIRCLE_RADIUS = SIZE * 2;

export default function Pan() {
  const translate = useSharedValue({ translateX: 0, translateY: 0 });
  const prevPosition = useSharedValue({ translateX: 0, translateY: 0 });
  const { height, width } = Dimensions.get("screen");
  const maxTranslateX = Number(width / 2) - Number(SIZE / 2);
  const maxTranslateY = Number(height / 2) - Number(SIZE / 2);

  const panGestureEvent = Gesture.Pan()
    .onStart(() => {
      prevPosition.value = {
        translateX: translate.value.translateX,
        translateY: translate.value.translateY,
      };
    })
    .onUpdate((event) => {
      // Prevent going out of screen
      let finalTranslateX = prevPosition.value.translateX + event.translationX;
      if (Math.abs(finalTranslateX) >= maxTranslateX) {
        finalTranslateX = finalTranslateX < 0 ? -maxTranslateX : maxTranslateX;
      }

      let finalTranslateY = prevPosition.value.translateY + event.translationY;
      if (Math.abs(finalTranslateY) >= maxTranslateY) {
        finalTranslateY = finalTranslateY < 0 ? -maxTranslateY : maxTranslateY;
      }

      translate.value = {
        translateX: finalTranslateX,
        translateY: finalTranslateY,
      };
    })
    .onEnd(() => {
      // Distance from center of the screen/square
      const distance = Math.sqrt(
        translate.value.translateX ** 2 + translate.value.translateY ** 2
      );
      if (distance < CIRCLE_RADIUS + SIZE / 2) {
        translate.value = withSpring({ translateX: 0, translateY: 0 });
      }
    });

  // const panGestureEventOld =
  //   useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
  //     onStart: (event) => {
  //       console.log(event.translationX);
  //       console.log(event.translationY);
  //     },
  //     onActive: (event) => {
  //       console.log({ event });
  //       translateX.value = event.translationX;
  //     },
  //     onEnd: (event) => {
  //       console.log(event.translationX);
  //       console.log(event.translationY);
  //     },
  //   });

  const dStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translate.value.translateX },
        { translateY: translate.value.translateY },
      ],
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <GestureDetector gesture={panGestureEvent}>
          <Animated.View style={[styles.square, dStyle]}></Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  square: {
    width: SIZE,
    height: SIZE,
    backgroundColor: "rgba(0, 0, 256, 0.5)",
    borderRadius: 20,
  },
  circle: {
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: CIRCLE_RADIUS,
    borderWidth: 5,
    borderColor: "rgba(0, 0, 256, 0.1)",
  },
});
