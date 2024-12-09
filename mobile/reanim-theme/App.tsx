import { useState } from "react";
import { StyleSheet, Switch } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

const Colors = {
  dark: {
    background: "#1E1E1E",
    circle: "#252525",
    text: "#F8F8F8",
  },
  light: {
    background: "#F8F8F8",
    circle: "#FFF",
    text: "#1E1E1E",
  },
};

const SWITCH_TRACK_COLOR = {
  true: "rgba(256, 0, 256, 0.2)",
  false: "rgba(0,0,0,0.1)",
};

type Theme = "light" | "dark";

export default function App() {
  const [value, setValue] = useState<Theme>("light");
  // const progress = useSharedValue<number>(0);
  const progress = useDerivedValue<number>(() => {
    // return value === "dark" ? 1 : 0;
    return value === "dark" ? withTiming(1) : withTiming(0); // With time will change the value from 0 to 1 and 1 to 0 in a gradual manner
  }, [value]);

  const dStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [Colors.light.background, Colors.dark.background]
    );
    return {
      backgroundColor,
    };
  });

  return (
    <Animated.View style={[styles.container, dStyle]}>
      <Switch
        value={value === "dark"}
        onValueChange={(bol) => setValue(bol ? "dark" : "light")}
        trackColor={SWITCH_TRACK_COLOR}
        // thumbColor="red"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
