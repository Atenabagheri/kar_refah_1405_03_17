import { useCallback, useEffect, useImperativeHandle, useState } from "react";
import { PiX } from "react-icons/pi";
import type { ChildRef } from "./FormPosition";
import type { BuildingType } from "../../../types/types";
import api from "../../../../api/axios";

export type SelectSearchType = {
  selectBuilding: BuildingType | null;
  setSelectBuilding: React.Dispatch<React.SetStateAction<BuildingType | null>>;
  ref: React.RefObject<ChildRef | null>;
};
const SelectBySearch = ({
  selectBuilding,
  setSelectBuilding,
  ref,
}: SelectSearchType) => {
  const [buildingData, setBuildingData] = useState<BuildingType[]>([]);

  const [search, setSearch] = useState("");

  const getBuilding = useCallback(async () => {
    if (search.length < 3) return;
    try {
      const res = await api.get(`/api/building/search?query=${search}`);
      // console.log(res?.data);;
      setBuildingData(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [search]);

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
  return (
    <div className="flex flex-col gap-2">
      {!selectBuilding && (
        <div className="relative w-full border border-gray-300 rounded-md bg-white">
          <input
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            className="text-sm !p-2 w-full outline-none"
            placeholder="کد پستی یا نام ساختمان..."
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
        {!selectBuilding && buildingData.length > 0 ? (
          <div className="bg-white border border-gray-300 rounded-md flex flex-col gap-0 max-h-[360px] overflow-y-auto">
            {buildingData?.map((b) => (
              <div
                key={b.postalCode}
                className="flex items-center gap-2 border-b border-b-neutral-200 !p-2"
                onClick={() => setSelectBuilding(b)}
              >
                <span className="text-sm">{b.name}</span>
                <span className="text-xs text-gray-500">{b.postalCode}</span>
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
              <span className="text-sm">{selectBuilding.name}</span>
              <span className="text-xs text-gray-500">
                {selectBuilding.postalCode}
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

export default SelectBySearch;
