import { useCallback, useEffect, useImperativeHandle, useState } from "react";
import { PiX } from "react-icons/pi";
import type { PositionType } from "../../../types/types";
import api from "../../../../api/axios";
import type { ChildRef } from "../form-position/FormPosition";

export type SelectSearchType = {
  selectPosition: PositionType | null;
  setSelectPosition: React.Dispatch<React.SetStateAction<PositionType | null>>;
  ref: React.RefObject<ChildRef | null>;
};
const SelectBySearchPosition = ({
  selectPosition,
  setSelectPosition,
  ref,
}: SelectSearchType) => {
  const [positionData, setPositionData] = useState<PositionType[]>([]);

  const [search, setSearch] = useState("");

  const getPosition = useCallback(async () => {
    if (search.length < 2) return;
    try {
      const res = await api.get(`/api/position/search?query=${search}`);
      // console.log(res?.data);;
      setPositionData(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [search]);

  useEffect(() => {
    if (search.length > 2) {
      const timeFetch = setTimeout(() => {
        getPosition();
      }, 1000);
      return () => {
        clearTimeout(timeFetch);
      };
    }
  }, [search, getPosition]);

  const clearSearch = () => {
    setSearch("");
    setPositionData([]);
  };

  const triggerFunction = () => {
    clearSearch();
  };

  useImperativeHandle(ref, () => ({
    triggerFunction,
  }));
  return (
    <div className="flex flex-col gap-2 w-full">
      {!selectPosition && (
        <div className="relative w-full border border-gray-300 rounded-md bg-white">
          <input
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            className="text-sm !p-2 w-full outline-none"
            placeholder="کد شغل یا عنوان شغلی..."
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
        {!selectPosition && positionData.length > 0 ? (
          <div className="bg-white border border-gray-300 rounded-md flex flex-col gap-0 max-h-[360px] overflow-y-auto">
            {positionData?.map((p) => (
              <div
                key={p.code}
                className="flex items-center gap-2 border-b border-b-neutral-200 !p-2"
                onClick={() => setSelectPosition(p)}
              >
                <span className="text-sm">{p.title}</span>
                <span className="text-xs text-gray-500">{p.code}</span>
              </div>
            ))}
          </div>
        ) : (
          positionData.length < 0 && (
            <span className="border-b border-b-neutral-200 !p-2 text-sm text-gray-500">
              موردی یافت نشد!
            </span>
          )
        )}
        {selectPosition && (
          <div className="bg-neutral-300 !p-2 border border-gray-300 rounded-md flex items-center gap-2 justify-between">
            <div className="flex flex-col gap-2">
              <span className="text-sm">{selectPosition.title}</span>
              <span className="text-xs text-gray-500">
                {selectPosition.code}
              </span>
            </div>
            <button
              onClick={() => setSelectPosition(null)}
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

export default SelectBySearchPosition;
