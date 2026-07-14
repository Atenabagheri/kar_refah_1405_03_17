import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { TooltipPayload } from "recharts/types/state/tooltipSlice";

type PieDataType = {
  name: string;
  value: number | null;
  color: string;
};
type DataTypeProps = {
  data: PieDataType[];
};

type Coordinate = {
  x: number;
  y: number;
};

type PieSectorData = {
  percent?: number;
  name?: string | number;
  midAngle?: number;
  middleRadius?: number;
  tooltipPosition?: Coordinate;
  value?: number;
  paddingAngle?: number;
  dataKey?: string;
  // payload?: string;
  tooltipPayload?: ReadonlyArray<TooltipPayload>;
};

type GeometrySector = {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
};

type PieLabelProps = PieSectorData &
  GeometrySector & {
    tooltipPayload?: string;
  };

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
      <text
        x={x}
        y={y}
        fill="black"
        direction={"ltr"}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm"
      >
        {`${((percent ?? 1) * 100).toFixed(0)}%`}
      </text>
  );
};

const MyPieChart = ({ data }: DataTypeProps) => {
  const newData = data?.filter((d) => d?.value);
  return (
    <div className="w-[200px] h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={200} height={200}>
          <Pie
            data={newData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {newData.map((entry, index) => (
              <Cell key={`cell-${entry.name}`} fill={newData[index].color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MyPieChart;
