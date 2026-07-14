import { Outlet, useNavigate, useParams } from "react-router";
import type { ProvinceType } from "../../types/types";
import { useState } from "react";
import { IranMap } from "react-iran-map";
import { mapData } from "../../data/mapData";
import MainCountyMap from "./MainCountyMap";
import MainProvinceDetails from "./MainProvinceDetails";
import { convertNumberToMonth } from "../../helper/convertNumberToMonth";
import { PiCaretLeft } from "react-icons/pi";

const MainProvinceMap = () => {
  const { province, dateCategory, name } = useParams();
  const navigte = useNavigate();
  const year = dateCategory && dateCategory?.slice(0, 4);
  const monthNumber = dateCategory && dateCategory?.slice(-2);

  const [selectedProvince, setSelectedProvince] = useState<string | undefined>(
    province
  );
  const selectProvinceHandler = (province: ProvinceType): void => {
    setSelectedProvince(province.name);
    console.log(province.faName);
    navigte(
      `/human-resources/unit-position/map/${dateCategory}/${province.name}`,
      { state: province.faName }
    );
  };
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between !pr-5">
        <p className="text-neutral-700 font-semibold">
          آمار و اطلاعات واحد‌های اداری سراسر کشور{" "}
          {convertNumberToMonth(Number(monthNumber))} {year}
        </p>
        <button
          onClick={() => navigte("/human-resources/unit-position/map")}
          className="flex items-center gap-1 !p-4 cursor-pointer"
        >
          <span>بازگشت</span>
          <PiCaretLeft />
        </button>
      </div>
      <div className="flex gap-0 items-start justify-center w-full h-full border-t border-t-neutral-300">
        <div className="flex flex-col h-full w-2/3 overflow-y-auto border-l border-l-neutral-300">
          <div className="w-fit hidden 2xl:block">
            <IranMap
              data={mapData}
              colorRange="30, 70, 181"
              width={200}
              textColor="#000"
              defaultSelectedProvince={province || undefined}
              deactiveProvinceColor="#eee"
              selectedProvinceColor="#3bcc6d"
              tooltipTitle="تعداد:"
              selectProvinceHandler={selectProvinceHandler}
            />
          </div>
          {selectedProvince && (
            <div className="w-full h-full flex items-center justify-center">
              <MainCountyMap />
            </div>
          )}
          {/* {selectedProvince && (
          <div className="w-1/2">
            <MainProvinceList />
          </div>
        )} */}
        </div>
        {/* <MainProvinceTab /> */}
        <div className="w-2/3 h-full">
          {name ? <Outlet /> : <MainProvinceDetails />}
        </div>
      </div>
    </div>
  );
};

export default MainProvinceMap;
