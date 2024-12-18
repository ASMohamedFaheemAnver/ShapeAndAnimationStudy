import { Dimensions, StyleSheet, Text } from "react-native";
import React from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type PageProps = {
  index: number;
  title: string;
  translateX: SharedValue<number>;
};

const { width: PAGE_WIDTH } = Dimensions.get("window");

const Page = ({ index, title, translateX }: PageProps) => {
  const pageOffset = PAGE_WIDTH * index; // This will order the page with correct offset

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value + pageOffset }],
    };
  });
  return (
    <Animated.View
      style={[
        {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: `rgba(0, 0, 256, 0.${index + 2})`,
          alignItems: "center",
          justifyContent: "center",
        },
        rStyle,
      ]}
    >
      <Text
        style={{
          fontSize: 72,
          fontWeight: "700",
          letterSpacing: 1.5,
          textTransform: "uppercase",
        }}
      >
        {title}
      </Text>
    </Animated.View>
  );
};

export default Page;
