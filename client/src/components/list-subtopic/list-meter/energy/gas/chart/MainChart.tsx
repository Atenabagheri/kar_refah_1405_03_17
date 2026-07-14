import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipContentProps,
} from "recharts";
import api from "../../../../../../../api/axios";
import { handleApiError } from "../../../../../../utils/handleApiError";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import type {
  BuildingType,
  GasBillType,
  SiteType,
} from "../../../../../../types/types";
import TotalChart from "../../electrictity/chart/TotalChart";

type PropsType = {
  billIdentifier: string | null;
  // serialNumber: string | null;
  filterByDate: string;
};

type FormattedDataType = {
  name: string;
  firstPeriod: number;
  secendPeriod: number;
  firstDays: number;
  secendDays: number;
  label: string;
};
type TotalType = {
  firstYear: {
    value: number;
    year: string;
  };
  secondYear: {
    value: number;
    year: string;
  };
};
type ChartType = {
  formattedData: FormattedDataType[];
  total: TotalType;
};

type DateBillsType = {
  result: { year: string; bills: GasBillType[] }[];
  buildingsCover: BuildingType[];
  building: BuildingType;
  site: SiteType;
};

const MainChart = ({
  billIdentifier,
  // serialNumber,
  filterByDate,
}: PropsType) => {
  console.log(billIdentifier);
  const [data, setData] = useState<FormattedDataType[] | null>(null);
  const [total, setTotal] = useState<TotalType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [firstYear, setFirstYear] = useState<string>(filterByDate || "");
  const [secondYear, setSecondYear] = useState<string>("");
  const [dateBills, setDateBills] = useState<DateBillsType | null>(null);

  const getData = async () => {
    if (
      !billIdentifier ||
      !firstYear ||
      !secondYear ||
      firstYear === secondYear
    )
      return;
    try {
      const res = await api.get<ChartType>(
        `/api/gas-bill/get-gas-bills-comparison/${billIdentifier}?firstYear=${firstYear}&secondYear=${secondYear}`
      );
      // console.log(res?.data);;
      setData(res.data.formattedData);
      setTotal(res.data.total);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const getDateBills = useCallback(async () => {
    if (!billIdentifier) return;
    try {
      const res = await api.get<DateBillsType>(
        `/api/gas-bill/get-date-gas-bills/${billIdentifier}`
      );
      // console.log(res?.data);;
      setDateBills(res.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [billIdentifier]);

  useEffect(() => {
    getDateBills();
  }, [getDateBills]);

  const CustomTooltip = (props: TooltipContentProps<ValueType, NameType>) => {
    const { active, payload } = props;
    const isVisible = active && payload && payload.length;
    const firstLable = isVisible && payload[0].payload.name.split("/")[0];
    const secondLable = isVisible && payload[1].payload.name.split("/")[1];

    return (
      <div
        className="custom-tooltip bg-white border border-neutral-300 !p-3 rounded shadow"
        style={{ visibility: isVisible ? "visible" : "hidden" }}
      >
        {isVisible && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-[#af6f76] rounded-sm"></div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-neutral-500">دوره</span>
                  <span className="text-neutral-500">{firstLable}:</span>
                </div>
                <span className="text-neutral-600 font-bold">
                  {payload[0].value}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-[#e6a7a7] rounded-sm"></div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-neutral-500">دوره</span>
                  <span className="text-neutral-500">{secondLable}:</span>
                </div>
                <span className="text-neutral-600 font-bold">
                  {payload[1].value}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const dateBillsMemoized = useMemo(() => {
    return dateBills?.result?.map((y) => (
      <option key={y.year} value={y.year}>
        {y.year}
      </option>
    ));
  }, [dateBills]);

  return (
    <>
      <div className="flex items-center justify-between !p-3 overflow-y-auto">
        <div className="flex items-center gap-4">
          <select
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setFirstYear(e.target.value)
            }
            value={firstYear}
            className={`!p-2 rounded-md ${firstYear < secondYear ? "bg-[#af6f76]" : "bg-[#e6a7a7]"}`}
          >
            <option value={""}>انتخاب کنید</option>
            {dateBillsMemoized}
          </select>
          <select
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSecondYear(e.target.value)
            }
            value={secondYear}
            className={`!p-2 rounded-md ${secondYear > firstYear ? "bg-[#e6a7a7]" : "bg-[#af6f76]"}`}
          >
            <option value={""}>انتخاب کنید</option>
            {dateBillsMemoized}
          </select>
        </div>
        <button
          disabled={
            firstYear === "" || secondYear === "" || firstYear === secondYear
              ? true
              : false
          }
          onClick={getData}
          className="bg-primary text-white !p-2 rounded-md disabled:bg-neutral-200 disabled:text-neutral-500 disabled:cursor-default cursor-pointer"
        >
          مشاهده نمودار
        </button>
      </div>
      <div className="w-full h-[90%] !mx-auto overflow-y-auto">
        {loading ? (
          <p className="text-neutral-500 !py-16 flex items-center justify-center">
            در حال بارگزاری چارت...
          </p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="60%">
              <BarChart
                data={data || undefined}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" direction="ltr" />
                <YAxis direction="ltr" />
                <Tooltip content={CustomTooltip} />
                <Bar
                  dataKey="firstPeriod"
                  fill="#e6a7a7"
                  activeBar={<Rectangle stroke="gray" />}
                  radius={[10, 10, 0, 0]}
                  direction="ltr"
                />
                <Bar
                  dataKey="secendPeriod"
                  fill="#af6f76"
                  activeBar={<Rectangle stroke="gray" />}
                  radius={[10, 10, 0, 0]}
                  direction="ltr"
                />
              </BarChart>
            </ResponsiveContainer>
            <TotalChart
              total={total}
              firstColor="#e6a7a7"
              secondColor="#af6f76"
              type="مترمکعب"
            />
          </>
        )}
      </div>
    </>
  );
};

export default MainChart;
