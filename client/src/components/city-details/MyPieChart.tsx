import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
import type { PieLabelProps } from "recharts/types/polar/Pie";

type PieDataType = {
  name: string;
  value: number | null;
};
type DataTypeProps = {
  data: PieDataType[];
};
const MyPieChart = ({ data }: DataTypeProps) => {
  const COLORS = ["#dcfce7 ", "#ffe2e2 "];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: PieLabelProps) => {
    const radius =
      Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
    const x = (cx ?? 0) + radius * Math.cos(-Number(midAngle) * RADIAN);
    const y = (cy ?? 0) + radius * Math.sin(-Number(midAngle) * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > (cx ?? 0) ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(Number(percent) * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-[200px] h-[200px] !ml-12">
      {data && (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={200} height={200}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              // outerRadius={80}
              // fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MyPieChart;
