import { useState } from "react";
import { IranMap } from "react-iran-map";
import { mapData } from "../../../data/mapData";
import MainMenu from "./MainMenu";
import type { ProvinceType } from "../../../types/types";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  getProvinceDashboard,
  setProvince,
} from "../../../redux/slices/dashboard/provinceDashboardSlice";

const MainDashboardProvince = () => {
  const { user } = useAppSelector((state) => state.auth);
  const MPO = user?.roles === "MPO";
  const dispatch = useAppDispatch();
  const [selectedProvince, setSelectedProvince] = useState<ProvinceType | null>(
    null
  );
  const selectProvinceHandler = async (province: ProvinceType) => {
    if (MPO && user?.province.name !== province?.name) return;
    setSelectedProvince(province);
    await dispatch(setProvince(province));
    await dispatch(getProvinceDashboard({ provinceName: province?.name }));
  };

  return (
    <main className="w-full h-full flex items-center justify-center">
      <IranMap
        data={mapData}
        colorRange="30, 70, 181"
        width={600}
        textColor="#000"
        // defaultSelectedProvince={province || undefined}
        deactiveProvinceColor="#eee"
        selectedProvinceColor="#3bcc6d"
        tooltipTitle="تعداد:"
        selectProvinceHandler={selectProvinceHandler}
      />
      {selectedProvince && (
        <MainMenu setSelectedProvince={setSelectedProvince} />
      )}
    </main>
  );
};

export default MainDashboardProvince;
