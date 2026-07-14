import { useCallback, useEffect, useImperativeHandle, useState } from "react";
import { PiX } from "react-icons/pi";
import type { BuildingType } from "../../types/types";
import api from "../../../api/axios";

export interface ChildRef {
  triggerFunction: () => void;
}

export type SelectSearchType = {
  selectBuilding: BuildingType | null;
  setSelectBuilding: React.Dispatch<React.SetStateAction<BuildingType | null>>;
  ref: React.RefObject<ChildRef | null>;
  county?: string;
  disabled?: boolean;
};
const SelectBySearchBuilding = ({
  selectBuilding,
  setSelectBuilding,
  ref,
  county,
  disabled,
}: SelectSearchType) => {
  const [buildingData, setBuildingData] = useState<BuildingType[]>([]);

  const [search, setSearch] = useState("");

  const getBuilding = useCallback(async () => {
    if (search.length < 3) return;
    try {
      const res = await api.get(
        `/api/building/search?query=${search}&county=${county}`,
      );
      // console.log(res?.data);;
      setBuildingData(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [search, county]);

  useEffect(() => {
    if (search.length > 3) {
      const timeFetch = setTimeout(() => {
        getBuilding();
      }, 1000);
      return () => {
        clearTimeout(timeFetch);
      };
    }
  }, [search, getBuilding]);

  const clearSearch = () => {
    setSearch("");
    setBuildingData([]);
  };

  const triggerFunction = () => {
    clearSearch();
  };

  useImperativeHandle(ref, () => ({
    triggerFunction,
  }));

  useEffect(() => {
    setSelectBuilding(null);
  }, [setSelectBuilding, county]);
  return (
    <div className="flex flex-col gap-2">
      {!selectBuilding && (
        <div className="relative w-full border border-gray-300 rounded-md bg-white overflow-hidden">
          <input
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            className="text-sm !p-2 w-full outline-none disabled:bg-dark/10"
            placeholder="کد پستی یا نام ساختمان..."
            value={search}
            disabled={disabled}
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
        {!selectBuilding && buildingData.length > 0 ? (
          <div className="bg-white border border-gray-300 rounded-md flex flex-col gap-0 max-h-[360px] overflow-y-auto">
            {buildingData?.map((b) => (
              <div
                key={b.postalCode}
                className="flex items-center gap-2 border-b border-b-neutral-200 !p-2"
                onClick={() => setSelectBuilding(b)}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{b.name}</span>
                    <span className="text-sm font-bold text-gray-700">
                      {b.postalCode}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700">
                    آدرس: {b.address}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          buildingData.length < 0 && (
            <span className="border-b border-b-neutral-200 !p-2 text-sm text-gray-500">
              موردی یافت نشد!
            </span>
          )
        )}
        {selectBuilding && (
          <div className="bg-neutral-300 !p-2 border border-gray-300 rounded-md flex items-center gap-2 justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">{selectBuilding.name}</span>
                <span className="text-sm font-bold text-gray-700">
                  {selectBuilding.postalCode}
                </span>
              </div>
              <span className="text-sm text-gray-700">
                آدرس: {selectBuilding.address}
              </span>
            </div>
            <button
              onClick={() => setSelectBuilding(null)}
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

export default SelectBySearchBuilding;
