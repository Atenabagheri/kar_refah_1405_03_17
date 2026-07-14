import { useState } from "react";
import ButtonTab from "./ButtonTab";
import {
  PiBuildingDuotone,
  PiCarDuotone,
  PiInfoDuotone,
  PiPersonSimpleSwimDuotone,
  PiThermometerDuotone,
} from "react-icons/pi";
import MainProvinceDashboardInfo from "./info/MainProvinceDashboardInfo";
import MainProvanceDashboardBuilding from "./buildings/MainProvanceDashboardBuilding";
import MainProvinceDashboardVehicles from "./vehicles/MainProvinceDashboardVehicles";
import MainProvinceDashboardMeters from "./meters/MainProvinceDashboardMeters";
import MainProvinceDashboardSportsBuilding from "./sports-building/MainProvinceDashboardSportsBuilding";

export type TabType = "info" | "vehicle" | "building" | "sports" | "energy";

const MainLeftSide = () => {
  const [tabMenu, setTabMenu] = useState<TabType>("info");
  return (
    <div className="w-[50%] h-full overflow-hidden border-2 border-dark/20 rounded-xl">
      <div className="flex flex-col gap-2 w-full h-full">
        <div className="flex items-center gap-2 overflow-hidden overflow-x-auto !p-2">
          <ButtonTab
            title="استان"
            active="info"
            tabMenu={tabMenu}
            setTabMenu={setTabMenu}
            icon={<PiInfoDuotone />}
          />
          <ButtonTab
            title="خودرو"
            active="vehicle"
            tabMenu={tabMenu}
            setTabMenu={setTabMenu}
            icon={<PiCarDuotone />}
          />
          <ButtonTab
            title="ساختمان"
            active="building"
            tabMenu={tabMenu}
            setTabMenu={setTabMenu}
            icon={<PiBuildingDuotone />}
          />
          <ButtonTab
            title="مجموعه های فرهنگی ورزشی"
            active="sports"
            tabMenu={tabMenu}
            setTabMenu={setTabMenu}
            icon={<PiPersonSimpleSwimDuotone />}
          />
          <ButtonTab
            title="مصارف انرژی"
            active="energy"
            tabMenu={tabMenu}
            setTabMenu={setTabMenu}
            icon={<PiThermometerDuotone />}
          />
        </div>
        <div className="overflow-y-auto h-full">
          {tabMenu === "info" && <MainProvinceDashboardInfo />}
          {tabMenu === "vehicle" && <MainProvinceDashboardVehicles />}
          {tabMenu === "building" && <MainProvanceDashboardBuilding />}
          {tabMenu === "sports" && <MainProvinceDashboardSportsBuilding />}
          {tabMenu === "energy" && <MainProvinceDashboardMeters />}
        </div>
      </div>
    </div>
  );
};

export default MainLeftSide;
