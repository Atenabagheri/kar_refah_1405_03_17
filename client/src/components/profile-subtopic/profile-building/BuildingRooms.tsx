import { useNavigate } from "react-router";
import type { RoomsType } from "../../../types/types";
import { PiMagnifyingGlass, PiUserCircle, PiXCircle } from "react-icons/pi";
import { useState } from "react";

interface PropsType {
  floor: string;
  items: RoomsType[];
}

const BuildingRooms = ({ floor, items }: PropsType) => {
  const [show, setShow] = useState<boolean>(false);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const searchItem = search.length
    ? items.filter(
        (item) =>
          item.employees?.find((f) =>
            (f.firstName + " " + f.lastName).includes(search),
          ) ||
          item.number.split("_").pop()?.includes(search) ||
          item.name?.includes(search),
      )
    : items;

  return (
    <div className="flex flex-col !gap-3 border border-neutral-400 !p-2 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          {floor === "0" ? <span>همکف</span> : <span>طبقه {floor}</span>}
        </div>
        <span className="text-neutral-500 text-sm">
          اتاق‌ها: {items.length}
        </span>
        <button
          onClick={() => setShow(!show)}
          className="cursor-pointer text-sm bg-neutral-200 rounded-md !p-1.5"
        >
          {show ? "عدم نمایش" : "نمایش اتاق ها"}
        </button>
      </div>
      {show && (
        <div className="flex flex-col gap-2">
          <div className="w-full relative">
            <input
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              placeholder="جستجو"
              className="outline-none border border-neutral-300 bg-neutral-100 rounded-xl !p-2 text-dark w-full !pr-9 text-sm"
            />
            <button className="text-2xl text-gray absolute top-1/2 -translate-y-1/2 right-2 text-neutral-400">
              <PiMagnifyingGlass />
            </button>
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-3 !gap-3">
            {searchItem?.map((room) => {
              let roomNumber: string | undefined = room.number;

              if (roomNumber.includes("_")) {
                roomNumber = roomNumber.split("_").pop();
              }

              return (
                <div
                  onClick={() => navigate(`/support/rooms/${room?.number}`)}
                  className={`${room?.employees?.length ? "bg-primary/20" : "bg-gray-100"} text-center cursor-pointer max-w-[200px] min-h-[60px] flex flex-col gap-1 text-dark rounded-xl !p-1.5 text-xs !space-y-3`}
                  key={room?.number}
                >
                  <span className="text-sm text-blue-950">
                    <span className="font-semibold">{roomNumber}</span> -{" "}
                    {room?.name}
                  </span>
                  <div className="flex items-center gap-1 flex-wrap">
                    {room?.employees?.length ? (
                      <>
                        <PiUserCircle className="text-xl" />
                        {room?.employees.map((em) => (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/general/employee/${em.nationalId}`);
                            }}
                            key={em.nationalId}
                            className="text-dark !p-0.5 rounded-md text-xs"
                          >
                            {(em.firstName || "-") +
                              " " +
                              (em?.lastName || "-")}
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="flex items-center gap-1">
                        <PiXCircle className="text-xl text-rose-700" />
                        <span>اتاق خالی است</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildingRooms;
