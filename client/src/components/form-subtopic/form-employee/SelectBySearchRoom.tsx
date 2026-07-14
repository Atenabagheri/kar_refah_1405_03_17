import { useCallback, useEffect, useImperativeHandle, useState } from "react";
import { PiX } from "react-icons/pi";
import type { ChildRef } from "./FormEmployee";
import api from "../../../../api/axios";
import type { RoomsType } from "../../../types/types";

export type SelectSearchType = {
  selectRoom: RoomsType | null;
  setSelectRoom: React.Dispatch<React.SetStateAction<RoomsType | null>>;
  ref: React.RefObject<ChildRef | null>;
};
const SelectBySearchRoom = ({
  selectRoom,
  setSelectRoom,
  ref,
}: SelectSearchType) => {
  const [roomData, setRoomData] = useState<RoomsType[]>([]);

  const [search, setSearch] = useState("");

  const getRoom = useCallback(async () => {
    if (search.length < 2) return;
    try {
      const res = await api.get(`/api/room/search?query=${search}`);
      // console.log(res?.data);;
      setRoomData(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [search]);

  useEffect(() => {
    if (search.length > 2) {
      const timeFetch = setTimeout(() => {
        getRoom();
      }, 1000);
      return () => {
        clearTimeout(timeFetch);
      };
    }
  }, [search, getRoom]);

  const clearSearch = () => {
    setSearch("");
    setRoomData([]);
  };

  const triggerFunction = () => {
    clearSearch();
  };

  useImperativeHandle(ref, () => ({
    triggerFunction,
  }));

  const roomNumber = (room: string) => {
    if (!room) return;
    const newRoomNumber = room.includes("_") ? room.split("_")[2] : room;
    return newRoomNumber;
  };
  return (
    <div className="flex flex-col gap-2 w-full">
      {!selectRoom && (
        <div className="relative w-full border border-gray-300 rounded-md bg-white">
          <input
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            className="text-sm !p-2 w-full outline-none"
            placeholder="کد اتاق یا عنوان اتاق..."
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
        {!selectRoom && roomData.length > 0 ? (
          <div className="bg-white border border-gray-300 rounded-md flex flex-col gap-0 max-h-[360px] overflow-y-auto">
            {roomData?.map((r) => (
              <div
                key={r.number}
                className="flex items-center gap-2 border-b border-b-neutral-200 !p-2"
                onClick={() => setSelectRoom(r)}
              >
                <span className="text-sm">{r.name}</span>
                <span className="text-xs text-gray-500">{roomNumber(r.number)}</span>
              </div>
            ))}
          </div>
        ) : (
          roomData.length < 0 && (
            <span className="border-b border-b-neutral-200 !p-2 text-sm text-gray-500">
              موردی یافت نشد!
            </span>
          )
        )}
        {selectRoom && (
          <div className="bg-neutral-300 !p-2 border border-gray-300 rounded-md flex items-center gap-2 justify-between">
            <div className="flex flex-col gap-2">
              <span className="text-sm">{selectRoom.name}</span>
              <span className="text-xs text-gray-500">{roomNumber(selectRoom.number)}</span>
            </div>
            <button
              onClick={() => setSelectRoom(null)}
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

export default SelectBySearchRoom;
