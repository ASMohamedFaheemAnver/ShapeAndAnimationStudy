import "./App.css";
import { ToffeeChart } from "./components/ToffeeChart";

function App() {
  const data = [
    { name: "Monday", min: 75, max: 125, median: 100 },
    { name: "Tuesday", min: 65, max: 105, median: 85 },
    { name: "Wednesday", min: 95, max: 135, median: 115 },
    { name: "Thursday", min: 100, max: 160, median: 130 },
    { name: "Friday", min: 115, max: 155, median: 135 },
    { name: "Saturday", min: 130, max: 180, median: 155 },
    { name: "Sunday", min: 140, max: 190, median: 165 },
  ];
  return (
    <ToffeeChart
      data={data}
      width={800}
      height={600}
      yAxisName={"mmHg"}
      textClr={"black"}
    />
  );
}

export default App;
