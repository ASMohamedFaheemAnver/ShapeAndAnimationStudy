import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Svg, { LinearGradient, Path, Stop } from "react-native-svg";
import * as shape from "d3-shape";
import { scaleTime, scaleLinear, scaleQuantile } from "d3-scale";
import { svgPathProperties } from "svg-path-properties";
import { useCallback, useEffect, useRef, useState } from "react";
const d3 = {
  shape,
};

export default function App() {
  const height = 200;
  const verticalPadding = 5;
  const cursorRadius = 10;
  const labelWidth = 100;
  const [x, setX] = useState(new Animated.Value(0));
  const { width } = Dimensions.get("window");

  const data = [
    { x: new Date(2018, 9, 1), y: 0 },
    { x: new Date(2018, 9, 16), y: 0 },
    { x: new Date(2018, 9, 17), y: 200 },
    { x: new Date(2018, 10, 1), y: 200 },
    { x: new Date(2018, 10, 2), y: 300 },
    { x: new Date(2018, 10, 5), y: 300 },
  ];
  const scaleX = scaleTime()
    .domain([new Date(2018, 9, 1), new Date(2018, 10, 5)])
    .range([0, width]);
  const scaleY = scaleLinear()
    .domain([0, 300])
    .range([height - verticalPadding, 0 + verticalPadding]);

  const scaleLabel = scaleQuantile().domain([0, 200]).range([0, 100, 150, 200]);

  const line = d3.shape
    .line()
    .x((d) => {
      return scaleX(d.x);
    })
    .y((d) => {
      return scaleY(d.y);
    })
    .curve(d3.shape.curveBasis)(data);
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    container: {
      marginTop: 60,
      height,
      width,
    },
    cursor: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderColor: "#367be2",
      borderWidth: 3,
      backgroundColor: "white",
    },
    label: {
      position: "absolute",
      top: -45,
      left: 0,
      backgroundColor: "lightgray",
      width: labelWidth,
    },
  });

  const properties = new svgPathProperties(line);
  const lineLength = properties.getTotalLength();

  const cursorRef = useRef(null);
  const labelRef = useRef(null);
  console.log({ lineLength, width });

  const moveCursor = useCallback((value) => {
    const { x, y } = properties.getPointAtLength(lineLength - value);
    cursorRef.current.setNativeProps({
      top: y - cursorRadius,
      left: x - cursorRadius,
    });
    const label = scaleLabel(scaleY.invert(y));
    labelRef.current.setNativeProps({ text: `${label}$` });
    labelRef.current.setNativeProps({ text: `${label}$` });
  }, []);

  useEffect(() => {
    if (!cursorRef.current) return;
    const id = x.addListener(({ value }) => moveCursor(value));
    moveCursor(0);
    return () => x.removeListener(id);
  }, [moveCursor, x, cursorRef.current]);

  const translateX = x.interpolate({
    inputRange: [0, lineLength],
    outputRange: [width - labelWidth, 0],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Svg {...{ width, height }}>
          <Path d={line} fill="transparent" stroke="#367be2" strokeWidth={5} />

          {/* Create liner gradient */}
          {/* Ref: https://react-svgr.com/playground/?native=true */}
          <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="gradient">
            <Stop stopColor="#CDE3F8" offset="0%" />
            <Stop stopColor="#eef6fd" offset="80%" />
            <Stop stopColor="#FEFFFF" offset="100%" />
          </LinearGradient>
          <Path
            // line, (width, height), (0, height)
            d={`${line} L${width} ${height} L0 ${height}`}
            fill="url(#gradient)"
          />
          <View ref={cursorRef} style={styles.cursor}></View>
        </Svg>
        <Animated.View style={[styles.label, { transform: [{ translateX }] }]}>
          <TextInput ref={labelRef} />
        </Animated.View>
        <Animated.ScrollView
          style={{ ...StyleSheet.absoluteFill }}
          contentContainerStyle={{ width: lineLength * 2 }}
          // showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          bounces={false}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: { x },
                },
              },
            ],
            { useNativeDriver: true }
          )}
          horizontal
        />
      </View>
    </SafeAreaView>
  );
}
