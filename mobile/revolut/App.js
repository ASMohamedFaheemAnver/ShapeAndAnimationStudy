import { Dimensions, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, LinearGradient, Path, Stop } from "react-native-svg";
import * as shape from "d3-shape";
import { scaleTime, scaleLinear } from "d3-scale";

const d3 = {
  shape,
};

export default function App() {
  const height = 200;
  const verticalPadding = 5;
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
        </Svg>
      </View>
    </SafeAreaView>
  );
}
