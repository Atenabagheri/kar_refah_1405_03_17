import { PiCarDuotone } from "react-icons/pi";
import { useAppSelector } from "../../../../../redux/hooks";
import { Link } from "react-router";
import SingleCartInfo from "../SingleCartInfo";
import VehicleChart from "../../../headquarters/vehicle/VehicleChart";

const MainProvinceDashboardVehicles = () => {
  const { data } = useAppSelector((state) => state.provinceDashboard);
  return (
    <div>
      <div className="flex items-center justify-between w-full border-b border-b-neutral-400 !p-2">
        <div className="flex items-center gap-1 text-2xl text-neutral-800">
          <PiCarDuotone />
          <h3 className="text-sm">خودرو</h3>
        </div>
        <Link
          to={`/support/vehicle?type=province&p=${data?.info?.name}`}
          className="text-primary text-sm font-bold"
        >
          مشاهده لیست
        </Link>
      </div>
      <SingleCartInfo
        data={[
          { title: "کل خودروها", value: data?.vehicles?.total || 0 },
          // { title: "کاربری عمومی", value: data?.vehicles?.general || 0 },
          // { title: "کاربری اختصاصی", value: data?.vehicles?.special || 0 },
          ...(data?.vehicles?.byType?.map((item) => ({
            title: item.faName || item.name,
            value: item.count,
          })) || []),
        ]}
      />
      <div className="!pt-2">
        <VehicleChart
          data={
            data?.vehicles?.byType?.map((item) => ({
              name: item.faName || item.name,
              value: item.count,
            })) || []
          }
        />
      </div>
    </div>
  );
};

export default MainProvinceDashboardVehicles;
