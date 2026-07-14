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
import type { DataType } from "./Home";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

type PropsType = {
  dataMostEnergy: DataType[];
  dataLeastEnergy: DataType[];
  text: string;
};
const ChartEneregy = ({ dataMostEnergy, dataLeastEnergy, text }: PropsType) => {
  const CustomTooltip = (props: TooltipContentProps<ValueType, NameType>) => {
    const { active, payload, label } = props;
    const isVisible = active && payload && payload.length;

    const value = isVisible && payload[0].value;

    return (
      <div
        className="custom-tooltip bg-white border border-neutral-300 !p-3 rounded-lg shadow"
        style={{ visibility: isVisible ? "visible" : "hidden" }}
      >
        {isVisible && (
          <div className="flex flex-col gap-3 items-start text-sm">
            <div className="flex items-center gap-4">
              <span className="text-neutral-500">استان:</span>
              <span className="text-neutral-800">{label}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-neutral-500">مصرف:</span>
              <span className="text-neutral-800">{value}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{ width: "100%" }}
      className="bg-white !p-2 rounded-lg shadow-md space-y-8"
    >
      <div className="flex flex-col gap-2 items-center">
        <h4 className="text-neutral-500 text-sm">
          نمودار مصرف 10 استان پرمصرف انرژی {text}
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            width={500}
            height={200}
            data={dataMostEnergy}
            syncId="anyId"
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="provinceFaName" fontSize={14} />
            <YAxis direction={"ltr"} fontSize={14} />
            <Tooltip content={CustomTooltip} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#ffc9c9"
              fill="#ffc9c9"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-2 items-center">
        <p className="text-neutral-500 text-sm">
          نمودار 10 استان کم مصرف انرژی {text}
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            width={500}
            height={200}
            data={dataLeastEnergy}
            syncId="anyId"
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="provinceFaName" fontSize={14} />
            <YAxis direction={"ltr"} fontSize={14} />
            <Tooltip content={CustomTooltip} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#b9f8cf"
              fill="#b9f8cf"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartEneregy;
