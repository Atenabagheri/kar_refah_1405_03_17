import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

interface DataType {
  name: string;
  value: number;
  value2: number;
}

interface PropsType {
  data: DataType[];
}

const CustomTooltip = (props: TooltipContentProps<ValueType, NameType>) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: 10,
          borderRadius: 10,
          minWidth: "120px",
        }}
      >
        <div className="flex gap-1 text-sm justify-between items-center">
          <span className="text-dark/80">دوره:</span>
          <span>{label}</span>
        </div>

        <div className="flex gap-1 text-sm justify-between items-center">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-[#427BFF80] rounded-md"></div>
            <span className="text-dark/80">مصرف کل دوره:</span>
          </div>
          <span>{payload[0].value}</span>
        </div>
        <div className="flex gap-1 text-sm justify-between items-center">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-[#ffa2a2] rounded-md"></div>
            <span className="text-dark/80">متوسط مصرف 30 روز:</span>
          </div>
          <span>{payload[1].value}</span>
        </div>
      </div>
    );
  }

  return null;
};

const MyLineChart = ({ data }: PropsType) => {
  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <div className="flex items-center gap-2">
        <p className="bg-[#ffa2a2] !p-4 rounded-lg text-dark w-fit text-center text-sm">
          متوسط مصرف 30 روز(لیتر)
        </p>
        <p className="bg-[#427BFF80] !p-4 rounded-lg text-dark w-fit text-center text-sm">
          مصرف کل دوره(لیتر)
        </p>
      </div>
      <div style={{ width: "100%", margin: "auto" }}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            width={500}
            height={300}
            data={data}
            syncId="anyId"
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis direction={"ltr"} />
            <Tooltip content={CustomTooltip} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#FFB86A"
              fill="#427BFF"
            />
            <Area
              type="monotone"
              dataKey="value2"
              stroke="#fb2c36"
              fill="#ffa2a2"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MyLineChart;
