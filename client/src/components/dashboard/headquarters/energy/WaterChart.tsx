import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import api from "../../../../../api/axios";
import type { TooltipContentProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
type DataType = {
  name: string;
  period: string;
  postalCode: string;
  serialNumber: string;
  totalPeriod: number;
};
const WaterChart = () => {
  const [data, setData] = useState<DataType[] | undefined>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await api.get(`/api/dashboard/water-meters`);
        // console.log(res?.data);;
        setData(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const CustomTooltip = (props: TooltipContentProps<ValueType, NameType>) => {
    const { active, payload } = props;
    const isVisible = active && payload && payload.length;

    return (
      <div
        className="custom-tooltip bg-white border border-neutral-400 p-2 rounded shadow"
        style={{ visibility: isVisible ? "visible" : "hidden" }}
      >
        {isVisible && (
          <>
            <p className="label">{payload[0].payload.name}</p>
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex items-center gap-2 text-[#6ca8f7]">
                <span className="">میزان مصرف:</span>
                <span>{payload[0].value}</span>
              </div>
              <div className="flex items-center gap-2 text-[#6ca8f7]">
                <span className="">قبض دوره:</span>
                <span>{payload[0].payload.period}</span>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };
  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="text-center text-neutral-800 text-sm font-bold">
        نمودار آخرین قبض کنتورهای آب ستاد
      </p>
      <div className="w-full h-[300px] space-y-2">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full bg-neutral-300 rounded-xl animate-pulse">
            در حال بارگزاری نمودار...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart width={300} height={300} data={data}>
              <Area
                type="monotone"
                dataKey="totalPeriod"
                stroke="#6ca8f7"
                fill="#6ca8f7"
              />
              <Tooltip content={CustomTooltip} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default WaterChart;
