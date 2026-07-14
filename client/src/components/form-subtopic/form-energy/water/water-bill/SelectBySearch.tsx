import { useCallback, useEffect, useImperativeHandle, useState } from "react";
import { PiX } from "react-icons/pi";
import type { ChildRef } from "./FormWaterBill";
import api from "../../../../../../api/axios";
import type { WaterMetersType } from "../../../../../types/types";

export type SelectSearchType = {
  selectMeter: WaterMetersType | null;
  setSelectMeter: React.Dispatch<React.SetStateAction<WaterMetersType | null>>;
  ref: React.RefObject<ChildRef | null>;
};
const SelectBySearch = ({
  selectMeter,
  setSelectMeter,
  ref,
}: SelectSearchType) => {
  const [meterData, setMeterData] = useState<WaterMetersType[]>([]);

  const [search, setSearch] = useState("");

  const getMeter = useCallback(async () => {
    if (search.length < 3) return;
    try {
      const res = await api.get(`/api/water-meter/search?query=${search}`);
      // console.log(res?.data);;
      setMeterData(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [search]);

  useEffect(() => {
    if (search.length > 3) {
      const timeFetch = setTimeout(() => {
        getMeter();
      }, 1000);
      return () => {
        clearTimeout(timeFetch);
      };
    }
  }, [search, getMeter]);

  const clearSearch = () => {
    setSearch("");
    setMeterData([]);
  };

  const triggerFunction = () => {
    clearSearch();
  };

  useImperativeHandle(ref, () => ({
    triggerFunction,
  }));
  return (
    <div className="flex flex-col gap-2">
      {!selectMeter && (
        <div className="relative w-full border border-gray-300 rounded-md bg-white">
          <input
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            className="text-sm !p-2 w-full outline-none"
            placeholder="شماره کنتور یا شناسه قبض..."
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
        {!selectMeter && meterData.length > 0 ? (
          <div className="bg-white border border-gray-300 rounded-md flex flex-col gap-0 max-h-[360px] overflow-y-auto">
            {meterData?.map((b) => (
              <div
                key={b.billIdentifier}
                className="flex items-center gap-4 border-b border-b-neutral-200 !p-2"
                onClick={() => setSelectMeter(b)}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm">شناسه قبض: {b.billIdentifier}</span>
                  <span className="text-xs text-gray-500">
                    شماره کنتور: {b.serialNumber}
                  </span>
                </div>
                <div className="flex flex-col gap-1 bg-green-100 !p-2 rounded-md">
                  <span className="text-xs text-gray-900">
                    ساختمان: {b.building.name}
                  </span>
                  <span className="text-xs text-gray-900">
                    کد پستی: {b.building.postalCode}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          meterData.length < 0 && (
            <span className="border-b border-b-neutral-200 !p-2 text-sm text-gray-500">
              موردی یافت نشد!
            </span>
          )
        )}
        {selectMeter && (
          <div className="bg-neutral-300 !p-2 border border-gray-300 rounded-md flex items-center gap-2 justify-between">
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm">
                  شناسه قبض: {selectMeter.billIdentifier}
                </span>
                <span className="text-xs text-gray-500">
                  شماره کنتور: {selectMeter.serialNumber}
                </span>
              </div>
              <div className="flex flex-col gap-1 bg-green-100 !p-2 rounded-md">
                <span className="text-xs text-gray-900">
                  ساختمان: {selectMeter.building.name}
                </span>
                <span className="text-xs text-gray-900">
                  کد پستی: {selectMeter.building.postalCode}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectMeter(null)}
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

export default SelectBySearch;
