import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const SIZE = 100;

export default function Pan() {
  const translate = useSharedValue({ translateX: 0, translateY: 0 });
  const prevPosition = useSharedValue({ translateX: 0, translateY: 0 });

  const panGestureEvent = Gesture.Pan()
    .onStart((event) => {
      prevPosition.value = {
        translateX: event.translationX,
        translateY: event.translationY,
      };
    })
    .onUpdate((event) => {
      translate.value = {
        translateX: prevPosition.value.translateX + event.translationX,
        translateY: prevPosition.value.translateY + event.translationY,
      };
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
      <GestureDetector gesture={panGestureEvent}>
        <Animated.View style={[styles.square, dStyle]}></Animated.View>
      </GestureDetector>
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
});
