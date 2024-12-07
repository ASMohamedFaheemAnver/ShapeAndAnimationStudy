import { useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function App() {
  const progress = useSharedValue(1);
  const scale = useSharedValue(2);

  // In order to make this function accessible by UI thread we need to add "worklet"
  const handleRotation = (progress: SharedValue<number>) => {
    "worklet";
    return `${progress.value * 2 * Math.PI}rad`;
  };

  const dStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      borderRadius: (progress.value * 100) / 2,
      transform: [
        { scale: scale.value },
        // { rotate: `${progress.value * 2 * Math.PI}rad` },
        { rotate: handleRotation(progress) },
      ],
    };
    // Only js dependencies are needed, animated value are not needed to be added
  }, []);

  useEffect(() => {
    progress.value = withRepeat(withTiming(0.5, { duration: 1000 }), -1, true);
    // scale.value = withSpring(1, { duration: 1000 });
    // reverse: true will make it more smooth by reversing the applied dStyle while repeating
    scale.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.box, dStyle]} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: { height: 100, width: 100, backgroundColor: "blue" },
});
