import SingleCart from "../SingleCart";
import { PiComputerTowerDuotone } from "react-icons/pi";
import { Link } from "react-router";
import type { AssetDashbordType } from "../MainDashboardHeadquarters";

type PropsType = {
  data: AssetDashbordType;
};
const MainAssetDashboard = ({ data }: PropsType) => {
  return (
    <div className="w-full h-full bg-white border border-neutral-400 rounded-xl flex flex-col gap-0 overflow-hidden">
      <div className="flex items-center justify-between w-full border-b border-b-neutral-400 !p-2">
        <div className="flex items-center gap-1 text-2xl text-neutral-800">
          <PiComputerTowerDuotone />
          <h3 className="text-base">اموال</h3>
        </div>
        <Link to="/support/asset" className="text-primary text-sm font-bold">
          مشاهده لیست
        </Link>
      </div>

      <div className="flex flex-col gap-0">
        <SingleCart
          data={[
            { title: "دسته بندی ها", count: data?.totalCategory || 0 },
            { title: "کل دارایی ها", count: data?.total || 0 },
            { title: "دارایی های فعال", count: data?.active || 0 },
            { title: "دارایی های غیر فعال", count: data?.deactive || 0 },
            { title: "دارایی های ستاد", count: data?.hqs || 0 },
            { title: "دارایی های استان", count: data?.province || 0 },
          ]}
        />
      </div>
    </div>
  );
};

export default MainAssetDashboard;
