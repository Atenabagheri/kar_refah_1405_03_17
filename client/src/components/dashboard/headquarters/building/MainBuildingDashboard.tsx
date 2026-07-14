import SingleCart from "../SingleCart";
import { PiBuildingDuotone } from "react-icons/pi";
import { Link } from "react-router";
import MyPieChart from "./MyPieChart";
import type { BuildingDashbordType } from "../MainDashboardHeadquarters";

type PropsType = {
  data: BuildingDashbordType;
};

type PieDataType = {
  name: string;
  value: number | undefined;
};
const MainBuildingDashboard = ({ data }: PropsType) => {
  const pieData: PieDataType[] = [
    { name: "استیجاری", value: data?.leased },
    { name: "ملکی", value: data?.owner },
    { name: "سایر", value: data?.other },
  ];
  return (
    <div className="w-full h-full bg-white border border-neutral-400 rounded-xl flex flex-col gap-0 overflow-hidden">
      <div className="flex items-center justify-between w-full border-b border-b-neutral-400 !p-2">
        <div className="flex items-center gap-1 text-2xl text-neutral-800">
          <PiBuildingDuotone />
          <h3 className="text-base">ساختمان ها</h3>
        </div>
        <Link
          to="/support/buildings?type=hqs"
          className="text-primary text-sm font-bold"
        >
          مشاهده لیست
        </Link>
      </div>

      <div className="flex flex-col gap-0 w-full h-full overflow-y-auto">
        <SingleCart
          data={[
            { title: "کل ساختمان ها", count: data?.total || 0 },
            { title: "ستاد(وزارتخانه)", count: data?.hqs || 0 },
            { title: "استانی", count: data?.province || 0 },
            {
              title: "استیجاری",
              count: data?.leased || 0,
            },
            { title: "ملکی", count: data?.owner || 0 },
            { title: "سایر", count: data?.other || 0 },
          ]}
        />
        <div className="!pt-2">
          <MyPieChart data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default MainBuildingDashboard;
