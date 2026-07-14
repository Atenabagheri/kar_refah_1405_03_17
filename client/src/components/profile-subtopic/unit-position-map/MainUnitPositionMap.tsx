import { IranMap } from "react-iran-map";
import { mapData } from "../../../data/mapData";
import { useSearchParams } from "react-router";
import type { ProvinceType } from "../../../types/types";
import { useState } from "react";
import DateCategoryModal from "./DateCategoryModal";
import TabButton from "./tab-button/TabButton";

const MainUnitPositionMap = () => {
  const [searchParams] = useSearchParams();
  const province = searchParams.get("province");
  const [show, setShow] = useState<boolean>(false);
  const [selectProvince, setSelectProvince] = useState<ProvinceType | null>(
    null
  );
  const selectProvinceHandler = (province: ProvinceType): void => {
    setSelectProvince({ name: province.name, faName: province.faName });
    setShow(true);
  };
  return (
    <div className="!space-y-2">
      {/* tab */}
      <div className="flex justify-end !p-3">
        <TabButton />
      </div>
      <div className="flex items-center justify-center relative">
        {show && (
          <DateCategoryModal
            setShow={setShow}
            selectProvince={selectProvince}
          />
        )}
        <div className="absolute right-10 top-0">
          <img
            src="/assets/images/logo.svg"
            alt="وزارت تعاون، کار و رفاه اجتماعی"
            width={200}
            height={200}
          />
        </div>
        <IranMap
          data={mapData}
          colorRange="30, 70, 181"
          width={600}
          textColor="#000"
          defaultSelectedProvince={province || undefined}
          deactiveProvinceColor="#eee"
          selectedProvinceColor="#3bcc6d"
          tooltipTitle="تعداد:"
          selectProvinceHandler={selectProvinceHandler}
        />
      </div>
    </div>
  );
};

export default MainUnitPositionMap;
