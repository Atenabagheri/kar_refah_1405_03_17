import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip } from "recharts";
import type { PieLabelRenderProps } from "recharts";

type PieDataType = {
  name: string;
  value: number | undefined;
};
type DataTypeProps = {
  data: PieDataType[];
};
const MyPieChart = ({ data }: DataTypeProps) => {
  const COLORS = ["#ffb86a", "#c4b4ff", "#ffa1ad"];

  const renderCustomizedLabel = (props: PieLabelRenderProps) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    const RADIAN = Math.PI / 180;
    const radius: number =
      Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
    const x = Number(cx) + radius * Math.cos(-midAngle * RADIAN);
    const y = Number(cy) + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        // textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(Number(percent) * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="text-center text-neutral-800 text-sm font-bold">
        ساختمان ها بر اساس نوع مالکیت
      </p>
      <div className="w-full h-[300px] space-y-2">
        {data && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={200} height={300}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                dataKey="value"
              >
                {data.map((_, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default MyPieChart;
