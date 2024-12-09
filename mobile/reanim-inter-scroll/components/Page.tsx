import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

interface PageProps {
  title: String;
  index: number;
  translateX: SharedValue<number>;
}

// When user rotate screen this may be inaccurate better to call inside function if need accurate value, For now it's fine
const { height, width } = Dimensions.get("window");
const SIZE = width * 0.75;

const Page: React.FC<PageProps> = ({ index, title, translateX }) => {
  const dSquareStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      Number(translateX.value / width), // Current page index by scroll offsite
      [index - 1, index, index + 1], // From previous screen to current screen to next screen
      [0, 1, 0], // Change scale from 0 to 1 to 0
      Extrapolation.CLAMP // Avoid overflow and force the output range to [0, 1, 0], otherwise this will predict the value on overflow translateX.value / width
    );
    return {
      // Can just put { scale }, but I wanna be more explicit for examples for future me
      transform: [{ scale: scale }],
    };
  });

  return (
    <View
      style={[
        styles.pageContainer,
        {
          backgroundColor: `rgba(0, 0, 255, 0.${index + 2})`,
        },
      ]}
    >
      <Animated.View style={[styles.square, dSquareStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    height,
    width,
    alignItems: "center",
    justifyContent: "center",
  },
  square: {
    width: SIZE,
    height: SIZE,
    backgroundColor: "rgba(0, 0, 255, 0.4)",
  },
});

export default Page;
