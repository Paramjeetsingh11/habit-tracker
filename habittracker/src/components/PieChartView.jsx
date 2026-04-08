import { PieChart, Pie, Cell, Tooltip } from "recharts";

const data = [
  { name: "Completed", value: 60 },
  { name: "Missed", value: 40 }
];

const COLORS = ["#2ecc71", "#ff6b6b"];

function PieChartView() {
  return (
    <PieChart width={300} height={300}>
      <Pie data={data} dataKey="value" outerRadius={100}>
        {data.map((entry, index) => (
          <Cell key={index} fill={COLORS[index]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}

export default PieChartView;