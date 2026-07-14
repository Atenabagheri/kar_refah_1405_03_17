import { PiBuildingDuotone } from "react-icons/pi";
import { useAppSelector } from "../../../../../redux/hooks";
import SingleCartInfo from "../SingleCartInfo";
import { Link } from "react-router";
import MyPieChart from "../../../headquarters/building/MyPieChart";

type PieDataType = {
  name: string;
  value: number | undefined;
};
const MainProvanceDashboardBuilding = () => {
  const { data } = useAppSelector((state) => state.provinceDashboard);

  const pieData: PieDataType[] = [
    { name: "استیجاری", value: data?.buildings?.leased },
    { name: "ملکی", value: data?.buildings?.owner },
    { name: "سایر", value: data?.buildings?.other },
  ];
  return (
    <div>
      <div className="flex items-center justify-between w-full border-b border-b-neutral-400 !p-2">
        <div className="flex items-center gap-1 text-2xl text-neutral-800">
          <PiBuildingDuotone />
          <h3 className="text-sm">ساختمان های استان {data?.info.faName}</h3>
        </div>
        <Link
          to={`/support/buildings?type=province&p=${data?.info.name}`}
          className="text-primary text-sm font-bold"
        >
          مشاهده لیست
        </Link>
      </div>
      <SingleCartInfo
        data={[
          { title: "کل ساختمان ها", value: data?.buildings?.total || 0 },
          {
            title: "استیجاری",
            value: data?.buildings?.leased || 0,
          },
          { title: "ملکی", value: data?.buildings?.owner || 0 },
          { title: "سایر", value: data?.buildings?.other || 0 },
        ]}
      />
      <div className="!pt-2">
        <MyPieChart data={pieData} />
      </div>
    </div>
  );
};

export default MainProvanceDashboardBuilding;
