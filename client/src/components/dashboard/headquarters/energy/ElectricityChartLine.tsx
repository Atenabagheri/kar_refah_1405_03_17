import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import api from "../../../../../api/axios";
import type { TooltipContentProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
const ElectricityChartLine = () => {
  const [data, setData] = useState<unknown[] | undefined>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await api.get(`/api/dashboard/electricity-meters`);
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
            <div className="flex flex-col gap-1">
              <p className="label text-[#fe9a00]">
                میزان مصرف: {payload[0].value}
              </p>
              <p className="text-[#fe9a00]">
                قبض دوره: {payload[0].payload.period}
              </p>
            </div>
          </>
        )}
      </div>
    );
  };
  return (
    <div className="w-full h-[300px]">
      {loading ? (
        <div className="flex items-center justify-center w-full h-full bg-neutral-300 rounded-xl animate-pulse">
          در حال بارگزاری نمودار...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart width={300} height={300} data={data}>
            <Line
              type="monotone"
              dataKey="totalPeriod"
              stroke="#fe9a00"
              strokeWidth={2}
            />
            <Tooltip content={CustomTooltip} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ElectricityChartLine;
