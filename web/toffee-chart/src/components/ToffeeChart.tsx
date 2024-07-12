import * as d3 from "d3";
import { useEffect, useRef } from "react";
import ReactDOMServer from "react-dom/server";
import SvgColButton from "./ColButton";

const ranges = [
  { min: 0, max: 119, name: "Good", color: "#A8D07A" },
  { min: 120, max: 139, name: "Warning", color: "#FFAB00" },
  { min: 140, max: 350, name: "Bad", color: "#FF5630" },
];

const getRangeColor = (value: number) => {
  const range = ranges.find(
    (range) => value >= range.min && value <= range.max
  );
  return range ? range.color : "";
};

type ToffeeChartProps = {
  data: ToffeeData[];
  height: number;
  width: number;
  yAxisName: string;
  textClr: string;
};

type ToffeeData = {
  name: string;
  max: number;
  median: number;
  min: number;
};

type SvgElementType = {
  className:
    | string
    | number
    | boolean
    | readonly (string | number)[]
    | d3.ValueFn<
        SVGForeignObjectElement,
        ToffeeData,
        string | number | boolean | readonly (string | number)[]
      >;
  xAccessor: (arg0: ToffeeData) => string;
  yAccessor: (arg0: ToffeeData) => d3.NumberValue;
  dataAccessor: (arg0: ToffeeData) => number;
};
type SvgCreatorType = (
  props: SvgElementType
) => d3.Selection<SVGForeignObjectElement, unknown, SVGGElement, unknown>;

type TextElementType = {
  className:
    | string
    | number
    | boolean
    | readonly (string | number)[]
    | d3.ValueFn<
        SVGTextElement,
        ToffeeData,
        string | number | boolean | readonly (string | number)[]
      >;
  yAccessor: (arg0: ToffeeData) => d3.NumberValue;
  dataAccessor: (arg0: ToffeeData) => number;
  yAdjust?: number;
};

type TextCreatorType = (props: TextElementType) => void;

type ToffeeChartType = (props: ToffeeChartProps) => JSX.Element;

const ToffeeChart: ToffeeChartType = ({
  data,
  width,
  height,
  yAxisName,
  textClr,
}) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      // @ts-ignore
      .domain([0, d3.max(data, (d) => d.max)])
      .nice()
      .range([innerHeight, 0]);

    const customSvgGroup = svg
      .append("g")
      .attr("class", "custom-svg-elements")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // @ts-ignore
    const createSvgElement: SvgCreatorType = ({
      className,
      dataAccessor,
      xAccessor,
      yAccessor,
    }) => {
      return customSvgGroup
        .selectAll("." + className)
        .data(data)
        .enter()
        .append("foreignObject")
        .attr("class", className)
        .attr("x", (d) => xScale(xAccessor(d))! + 12)
        .attr("y", (d) => yScale(yAccessor(d)) - 12)
        .attr("width", 20)
        .attr("height", 47)
        .html((d) => {
          // Ref: https://stackoverflow.com/questions/56987569/how-to-get-html-code-from-reactjs-component
          const svgString = ReactDOMServer.renderToStaticMarkup(
            <SvgColButton fill={getRangeColor(dataAccessor(d))} />
          );
          console.log({ svgString });
          return svgString;
        });
    };

    const CreateTextElement: TextCreatorType = ({
      className,
      dataAccessor,
      yAccessor,
      yAdjust,
    }) => {
      customSvgGroup
        .selectAll("." + className)
        .data(data)
        .enter()
        .append("text")
        .attr("class", className)
        .attr("x", (d) => xScale(d.name)! + 22)
        .attr("y", (d) => yScale(yAccessor(d)) + (yAdjust ?? -10))
        .text((d) => dataAccessor(d))
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .transition()
        .duration(1000)
        .style("font-weight", "400")
        .style("fill", (d) => getRangeColor(dataAccessor(d)));
    };

    createSvgElement({
      className: "max-svg",
      dataAccessor: (d) => d.max,
      xAccessor: (d) => d.name,
      yAccessor: (d) => d.max,
    });

    // MIN

    // med

    customSvgGroup
      .selectAll(".median-line")
      .data(data)
      .enter()
      .append("line")
      .attr("class", "median-line")
      .attr("x1", (d) => xScale(d.name)! + 22)
      .attr("y1", (d) => yScale(d.min))
      .attr("x2", (d) => xScale(d.name)! + 22)
      .attr("y2", (d) => yScale(d.max))
      .transition()
      .duration(1000)
      .attr("stroke", (d) => getRangeColor(d.median))
      .attr("stroke-width", 20)
      .attr("stroke-opacity", 0.2);

    createSvgElement({
      className: "min-svg",
      dataAccessor: (d) => d.min,
      xAccessor: (d) => d.name,
      yAccessor: (d) => d.min,
    });

    //txt

    CreateTextElement({
      className: "max-label",
      dataAccessor: (d) => d.max,
      yAccessor: (d) => d.max,
    });
    // min

    CreateTextElement({
      className: "min-label",
      dataAccessor: (d) => d.min,
      yAccessor: (d) => d.min,
      yAdjust: 20,
    });

    const dashedLineGroup = customSvgGroup
      .append("g")
      .attr("class", "dashed-lines");

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr(
        "transform",
        `translate(${margin.left},${innerHeight + margin.top})`
      )
      .style("font-size", "12px")
      .style("font-weight", "400")
      .style("stroke-width", "0px")
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("fill", textClr);

    svg
      .append("text")
      .attr("class", "y-axis-label")
      .attr("text-anchor", "middle")
      .attr("x", +20)
      .attr("y", 10)
      .text(yAxisName)
      .style("font-size", "12px")
      .style("font-weight", "400")
      .style("fill", textClr);

    svg
      .append("g")
      .attr("class", "y-axis")

      .attr("transform", `translate(${margin.left},${margin.top})`)
      .style("font-size", "12px")
      .style("font-weight", "400")
      .style("stroke-width", "0px")
      .call(d3.axisLeft(yScale).tickSize(0))
      .selectAll("text")
      .style("fill", textClr);

    svg
      .append("g")
      .attr("class", "y-axis-dash")
      .attr("transform", `translate(${margin.left},${margin.top})`)

      .style("stroke-width", "0px")
      .call(d3.axisRight(yScale).tickSize(width))
      .selectAll("line")
      .style("stroke-dasharray", "5, 5");

    svg
      .select(".y-axis-dash")
      .selectAll("line")
      .style("stroke-width", "1px")
      .style("opacity", 0.2)
      .style("stroke-dasharray", "5, 5");
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};
// will optimize later :3

export { ToffeeChart };
