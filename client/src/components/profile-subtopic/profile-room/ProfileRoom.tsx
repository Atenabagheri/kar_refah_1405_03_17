import {
  PiBuildingApartmentDuotone,
  PiCaretLeft,
  PiDoorDuotone,
  PiUsersThreeDuotone,
} from "react-icons/pi";
import type { RoomsProfileType } from "../../../types/types";
import RoomGallery from "./gallery/RoomGallery";
import { useNavigate } from "react-router";
import EmployeeCard from "./EmployeeCard";
import RoomInfo from "./RoomInfo";
import AssetsCard from "../../../ui/AssetsCard";
import DeleteButton from "../../../ui/DeleteButton";
import { useAppSelector } from "../../../redux/hooks";

interface PropsType {
  data: RoomsProfileType;
}

const ProfileRoom = ({ data }: PropsType) => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  let roomNumber: string | undefined = data.number;

  if (roomNumber.includes("_")) {
    roomNumber = roomNumber.split("_").pop();
  }
  return (
    <div className="flex relative">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 cursor-pointer absolute top-5 left-3"
      >
        <span>بازگشت</span>
        <PiCaretLeft />
      </button>

      <div className="flex flex-col basis-2/3  border-l border-secondary/20 min-h-[92vh]">
        <div className="flex items-center justify-between border-b border-secondary/20 !p-5">
          <div className="!space-y-8 basis-1/2 w-full">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="text-lg flex items-center !gap-4">
                  <PiDoorDuotone className="text-3xl" />
                  <span className="text-lg">{data?.name}</span>
                </div>
                {user?.isAdmin && (
                  <DeleteButton
                    title={`اتاق ${data.name}`}
                    origin="profile"
                    url={`/api/room/delete-room/${data.number}`}
                  />
                )}
              </div>
              <div className="border-r border-r-secondary/30 !pr-5 !mr-3 !space-y-4">
                <RoomInfo title="شماره اتاق" value={roomNumber} />
                <RoomInfo title="طبقه" value={data?.floor?.number} />
                <RoomInfo title="توضیحات" value={data?.description} />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-lg flex items-center !gap-4">
                <PiBuildingApartmentDuotone className="text-3xl" />
                <h3>
                  {data?.building?.name?.startsWith("ساختمان")
                    ? data?.building?.name
                    : `ساختمان ${data?.building?.name}`}
                </h3>
              </div>
              <div className="border-r border-r-secondary/30 !pr-5 !mr-3 !space-y-4">
                <RoomInfo title="آدرس" value={data?.building?.address} />
                <RoomInfo title="کدپستی" value={data?.building?.postalCode} />
                <RoomInfo title="پلاک" value={data?.building?.number || "_"} />
              </div>
            </div>
          </div>
          <RoomGallery image={data.image} gallery={data.gallery} />
        </div>
        {/* افراد حاضر در اتاق */}
        <div className="!space-y-4 !p-5">
          <div className="text-lg flex items-center !gap-4">
            <PiUsersThreeDuotone className="text-3xl" />
            <h3>افراد حاضر در اتاق</h3>
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {data?.employees?.length < 1 ? (
              <span>موردی یافت نشد.</span>
            ) : (
              data?.employees?.map((employee) => (
                <EmployeeCard key={employee?.nationalId} employee={employee} />
              ))
            )}
          </div>
        </div>
      </div>
      {/* دارایی */}
      <div className="flex flex-col gap-4 basis-1/3 !p-5">
        <h3 className="text-dark/90">دارایی</h3>
        <div className="h-full">
          <div className="!space-y-3">
            {data?.assetsCategory?.length < 1 ? (
              <span>موردی یافت نشد.</span>
            ) : (
              data?.assetsCategory?.map((category) => (
                <AssetsCard
                  key={category?.code}
                  name={category?.name}
                  items={category?.assets}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileRoom;
