import { useState } from "react";
import ButtonTab from "./ButtonTab";
import MainTechnical from "./vehicle-tab/technical/MainTechnical";
import MainInsurance from "./vehicle-tab/insurance/MainInsurance";
import MainRepair from "./vehicle-tab/repair/MainRepair";

export type ActiveType = "Technical" | "Insurance" | "Repair";

const MainVehicleTab = () => {
  const [activeTab, setActiveTab] = useState<ActiveType>("Technical");

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-0 rounded-lg overflow-hidden">
        <ButtonTab
          active="Technical"
          title="مشخصات فنی"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <ButtonTab
          active="Insurance"
          title="سوابق بیمه"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <ButtonTab
          active="Repair"
          title="نگهداری و تعمیر"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      {activeTab === "Technical" && <MainTechnical />}
      {activeTab === "Insurance" && <MainInsurance />}
      {activeTab === "Repair" && <MainRepair />}
    </div>
  );
};

export default MainVehicleTab;
