import { useCallback, useEffect, useImperativeHandle, useState } from "react";
import { PiX } from "react-icons/pi";
import type { VehicleType } from "../../../../types/types";
import api from "../../../../../api/axios";
import type { ChildRef } from "./FormInsurance";
import SmartImage from "../../../../utils/SmartImage";
import LicensePlate from "../../../../ui/LicensePlate";

export type SelectSearchType = {
  selectVehicle: VehicleType | null;
  setSelectVehicle: React.Dispatch<React.SetStateAction<VehicleType | null>>;
  ref: React.RefObject<ChildRef | null>;
};
const SelectBySearchVehicle = ({
  selectVehicle,
  setSelectVehicle,
  ref,
}: SelectSearchType) => {
  const [vehicleData, setVehicleData] = useState<VehicleType[]>([]);

  const [search, setSearch] = useState("");

  const getVehicle = useCallback(async () => {
    if (search.length < 3) return;
    try {
      const res = await api.get(`/api/vehicle/search?query=${search}`);
      // console.log(res?.data);;
      setVehicleData(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [search]);

  useEffect(() => {
    if (search.length > 3) {
      const timeFetch = setTimeout(() => {
        getVehicle();
      }, 1000);
      return () => {
        clearTimeout(timeFetch);
      };
    }
  }, [search, getVehicle]);

  const clearSearch = () => {
    setSearch("");
    setVehicleData([]);
  };

  const triggerFunction = () => {
    clearSearch();
  };

  useImperativeHandle(ref, () => ({
    triggerFunction,
  }));

  const url = api?.defaults.baseURL;

  return (
    <div className="flex flex-col gap-0 w-full">
      {!selectVehicle && (
        <div className="relative w-full border border-gray-300 rounded-md bg-white">
          <input
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            className="text-sm !p-1.5 w-full outline-none"
            placeholder="شناسه VIN یا پلاک خودرو..."
            value={search}
          />
          {search.length > 0 && (
            <button
              onClick={clearSearch}
              className="cursor-pointer text-gray-400 text-lg absolute top-1/2 -translate-y-1/2 left-2"
            >
              <PiX />
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col gap-0">
        {!selectVehicle && vehicleData.length > 0 ? (
          <div className="bg-white border border-gray-300 rounded-md flex flex-col gap-0 max-h-[360px] overflow-y-auto">
            {vehicleData?.map((b) => (
              <div
                key={b.vin}
                className="flex items-center gap-2 border-b border-b-neutral-200 !p-2"
                onClick={() => setSelectVehicle(b)}
              >
                {!b.image ? (
                  <div className="flex items-center justify-center max-w-24 max-h-auto">
                    <img
                      src="/assets/images/not-found.png"
                      width={100}
                      height={100}
                      alt="بدون تصویر"
                      className="w-full h-full rounded-md object-cover object-center bg-white mx-auto"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center max-w-24 max-h-auto">
                    <SmartImage
                      src={url + b.image}
                      alt="main image"
                      width={100}
                      height={100}
                      loading="lazy"
                      className="w-full h-full rounded-md object-cover object-center bg-white mx-auto"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{b.model}</span>
                    <span className="text-xs text-gray-700 font-bold">
                      {b.vin}
                    </span>
                  </div>
                  {b.licensePlate && (
                    <LicensePlate licensePlate={b.licensePlate} />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          vehicleData.length < 0 && (
            <span className="border-b border-b-neutral-200 !p-2 text-sm text-gray-500">
              موردی یافت نشد!
            </span>
          )
        )}
        {selectVehicle && (
          <div className="bg-neutral-100 !p-2 border border-gray-300 rounded-md flex items-center gap-2 justify-between w-full">
            <div className="flex items-center gap-2">
              {!selectVehicle.image ? (
                <div className="flex items-center justify-center max-w-24 max-h-auto">
                  <img
                    src="/assets/images/not-found.png"
                    width={100}
                    height={100}
                    alt="بدون تصویر"
                    className="w-full h-full rounded-md object-cover object-center bg-white mx-auto"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center max-w-24 max-h-auto">
                  <SmartImage
                    src={url + selectVehicle.image}
                    alt="main image"
                    width={100}
                    height={100}
                    loading="lazy"
                    className="w-full h-full rounded-md object-cover object-center bg-white mx-auto"
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <span className="font-bold">{selectVehicle.model}</span>
                  <span className="text-xs text-gray-700 font-bold">
                    {selectVehicle.vin}
                  </span>
                </div>
                {selectVehicle.licensePlate && (
                  <LicensePlate licensePlate={selectVehicle.licensePlate} />
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectVehicle(null)}
              className="cursor-pointer text-rose-500 text-xl"
            >
              <PiX />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectBySearchVehicle;
