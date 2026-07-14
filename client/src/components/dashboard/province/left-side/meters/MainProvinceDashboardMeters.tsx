import { PiThermometerDuotone } from "react-icons/pi";
import { useAppSelector } from "../../../../../redux/hooks";
import SingleCartInfo from "../SingleCartInfo";
import { Link } from "react-router";

const MainProvinceDashboardMeters = () => {
  const { data } = useAppSelector((state) => state.provinceDashboard);
  return (
    <div>
      <div className="flex items-center justify-between w-full border-b border-b-neutral-400 !p-2">
        <div className="flex items-center gap-1 text-2xl text-neutral-800">
          <PiThermometerDuotone />
          <h3 className="text-sm">مصارف انرژی</h3>
        </div>
        <Link
          to={`/support/energy?meter=electricity&type=province&p=${data?.info?.name}`}
          className="text-primary text-sm font-bold"
        >
          مشاهده لیست
        </Link>
      </div>
      <SingleCartInfo
        data={[
          { title: "کل کنتور ها", value: data?.meters?.total || 0 },
          { title: "کنتور های برق", value: data?.meters?.totalElectric || 0 },
          { title: "کنتور های آب", value: data?.meters?.totalWater || 0 },
          { title: "کنتور های گاز", value: data?.meters?.totalGas || 0 },
        ]}
      />
    </div>
  );
};
export default MainProvinceDashboardMeters;
