import SingleCart from "../SingleCart";
import { PiCarDuotone } from "react-icons/pi";
import { Link } from "react-router";
import type { VehicleDashbordType } from "../MainDashboardHeadquarters";
import VehicleChart from "./VehicleChart";

type PropsType = {
  data: VehicleDashbordType;
};

const MainVehicleDashboard = ({ data }: PropsType) => {
  return (
    <div className="w-full h-full bg-white border border-neutral-400 rounded-xl flex flex-col gap-0 overflow-hidden">
      <div className="flex items-center justify-between w-full border-b border-b-neutral-400 !p-2">
        <div className="flex items-center gap-1 text-2xl text-neutral-800">
          <PiCarDuotone />
          <h3 className="text-base">خودرو</h3>
        </div>
        <Link to="/support/vehicle?type=hqs" className="text-primary text-sm font-bold">
          مشاهده لیست
        </Link>
      </div>

      <div className="flex flex-col gap-0 w-full h-full overflow-y-auto">
        <SingleCart
          data={[
            { title: "کل خودروها", count: data?.total || 0 },
            { title: "ستاد(وزاتخانه)", count: data?.hqs || 0 },
            { title: "استانی", count: data?.province || 0 },
            ...(data?.byType?.map((item) => ({
              title: item.faName || item.name,
              count: item.count,
            })) || []),
          ]}
        />
        <div className="!pt-2">
          <VehicleChart
            data={
              data?.byType?.map((item) => ({
                name: item.faName || item.name,
                value: item.count,
              })) || []
            }
          />
        </div>
      </div>
    </div>
  );
};

export default MainVehicleDashboard;
