import SingleCart from "../SingleCart";
import { PiThermometerDuotone } from "react-icons/pi";
import { Link } from "react-router";
import type { EnergyDashbordType } from "../MainDashboardHeadquarters";
import ElectricityChart from "./ElectricityChart";
import { useState } from "react";
import WaterChart from "./WaterChart";
import ButtonChart from "./ButtonChart";
import GasChart from "./GasChart";

type PropsType = {
  data: EnergyDashbordType;
};
type ShowType = "electricity" | "water" | "gas";
const MainEnergyDashboard = ({ data }: PropsType) => {
  const [showChart, setShowChart] = useState<ShowType>("electricity");
  return (
    <div className="w-full h-full bg-white border border-neutral-400 rounded-xl flex flex-col gap-0 overflow-hidden">
      <div className="flex items-center justify-between w-full border-b border-b-neutral-400 !p-2">
        <div className="flex items-center gap-1 text-2xl text-neutral-800">
          <PiThermometerDuotone />
          <h3 className="text-base">مصارف انرژی</h3>
        </div>
        <Link
          to="/support/energy?meter=electricity&type=hqs"
          className="text-primary text-sm font-bold"
        >
          مشاهده لیست
        </Link>
      </div>
      <div className="flex flex-col gap-0 overflow-y-auto h-full w-full">
        <SingleCart
          data={[
            { title: "کل کنتور ها", count: data?.total || 0 },
            { title: "کنتور های برق", count: data?.electric || 0 },
            { title: "کنتور های آب", count: data?.water || 0 },
            { title: "کنتور های گاز", count: data?.gas || 0 },
            { title: "کنتور های ستاد", count: data?.hqs || 0 },
            { title: "کنتور های استان", count: data?.province || 0 },
          ]}
        />
        <div className="flex flex-col items-center justify-center gap-2 !p-2 w-full">
          <div className="flex items-center justify-center gap-0 w-[70%]">
            <ButtonChart
              className="bg-[#f5a936] rounded-r-lg border-l-0"
              showChart="electricity"
              title="برق"
              setShowChart={setShowChart}
            />
            <ButtonChart
              className="bg-[#99beee]"
              showChart="water"
              title="آب"
              setShowChart={setShowChart}
            />
            <ButtonChart
              className="bg-[#f3ad74] rounded-l-lg border-r-0"
              showChart="gas"
              title="گاز"
              setShowChart={setShowChart}
            />
          </div>
          {showChart === "electricity" && <ElectricityChart />}
          {showChart === "water" && <WaterChart />}
          {showChart === "gas" && <GasChart />}
        </div>
      </div>
    </div>
  );
};

export default MainEnergyDashboard;
