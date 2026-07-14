import React from "react";
import { PiX } from "react-icons/pi";
import Modal from "../../../ui/Modal";
import type { ProvinceType } from "../../../types/types";
import { IranProvincesMap } from "react-iran-provinces-map";
import { provinceData } from "../../../data/provinceData";
import MainLeftSide from "./left-side/MainLeftSide";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setProvDashData } from "../../../redux/slices/dashboard/provinceDashboardSlice";

type PropsType = {
  // province: ProvinceType | null;
  setSelectedProvince: React.Dispatch<
    React.SetStateAction<ProvinceType | null>
  >;
};
const MainMenu = ({ setSelectedProvince }: PropsType) => {
  const dispatch = useAppDispatch();
  const { province } = useAppSelector((state) => state.provinceDashboard);
  const closeProvanceDashboardDetails = () => {
    setSelectedProvince(null);
    dispatch(setProvDashData());
  };
  return (
    <Modal className="w-[95%] h-[80vh] overflow-hidden">
      <div className="w-full h-full bg-light shadow-md rounded-xl !p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-neutral-700 text-sm">
            استان {province?.faName}
          </span>
          <button
            onClick={closeProvanceDashboardDetails}
            className="cursor-pointer"
          >
            <PiX />
          </button>
        </div>
        <div className="flex items-center justify-center gap-0 w-full h-[95%]">
          {/* right side */}
          <div className="flex items-center justify-center w-[60%]">
            {province && (
              <IranProvincesMap
                province={province?.name}
                provinceData={provinceData[province?.name]}
                colorRange="30, 70, 181"
                deactiveProvinceColor="#eee"
                // selectedProvinceColor="#3bcc6d"
                tooltipTitle="تعداد:"
                textColor="#000"
                width={600}
                // selectProvinceHandler={selectProvinceHandler}
              />
            )}
          </div>
          {/* left side */}
          <MainLeftSide />
        </div>
      </div>
    </Modal>
  );
};

export default MainMenu;
