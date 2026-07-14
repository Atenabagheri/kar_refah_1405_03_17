import {
  PiBriefcaseDuotone,
  PiCaretLeft,
  PiMapPinDuotone,
  PiUserDuotone,
} from "react-icons/pi";
import type { EmployeeType } from "../../../types/types";
import { Link, useNavigate } from "react-router";
import EmployeeInfo from "./EmployeeInfo";
import AssetsCard from "../../../ui/AssetsCard";
import VehicleCard from "../../../ui/VehicleCard";
import MainGallery from "../../../ui/gallery/MainGallery";
import DeleteButton from "../../../ui/DeleteButton";
import { useAppSelector } from "../../../redux/hooks";

interface PropsType {
  data: EmployeeType;
}

const ProfileEmployee = ({ data }: PropsType) => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  return (
    <div className="flex gap-0 relative">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 cursor-pointer absolute top-5 left-3"
      >
        <span>بازگشت</span>
        <PiCaretLeft />
      </button>
      <div className="!space-y-4 !p-5 basis-2/3 h-full border-l border-secondary/20 min-h-[92vh]">
        <div className="flex gap-2 w-full">
          <div className="!space-y-8 basis-1/2 w-full">
            <div className="flex flex-col gap-4">
              <div className="text-lg flex items-center !gap-4">
                <PiUserDuotone className="text-3xl" />
                <h3>اطلاعات کاربر</h3>
              </div>
              <div className="border-r border-r-secondary/30 !pr-5 !mr-3 !space-y-4">
                <div className="flex items-center gap-2">
                  <EmployeeInfo
                    title="نام"
                    value={
                      (data.firstName || "-") + " " + (data?.lastName || "-")
                    }
                  />

                  {user?.isAdmin && (
                    <DeleteButton
                      title={`کاربر ${(data.firstName || "-") + " " + (data?.lastName || "-")}`}
                      origin="profile"
                      url={`/api/employee/delete-employee/${data?.nationalId}`}
                    />
                  )}
                </div>
                <EmployeeInfo title="کدملی" value={data?.nationalId} />
                <EmployeeInfo title="شماره موبایل" value={data?.phone} />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <EmployeeInfo
                title="استان"
                icon={<PiMapPinDuotone className="text-3xl" />}
                value={data?.province?.faName}
              />
              <div className="border-r border-r-secondary/30 !pr-5 !mr-3 !space-y-4">
                <EmployeeInfo title="شهرستان" value={data?.county?.faName} />
                <EmployeeInfo title="آدرس" value={data?.address} />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-lg flex items-center !gap-4">
                <PiBriefcaseDuotone className="text-3xl" />
                <h3>اطلاعات شغلی</h3>
              </div>
              <div className="border-r border-r-secondary/30 !pr-5 !mr-3 !space-y-4">
                {data?.roomNumber && (
                  <Link
                    to={`/support/rooms/${data?.roomNumber?.number}`}
                    className="!space-x-2 flex bg-purple-300/40 !p-1.5 rounded-md border border-purple-300 w-fit"
                  >
                    <div className="flex items-center !gap-2">
                      <span className=" text-dark/90">اتاق :</span>
                    </div>
                    <p>{data?.roomNumber?.name || "_"}</p>
                  </Link>
                )}
                {data?.positionCode && (
                  <Link
                    to={`/general/position/${data?.positionCode?.code}`}
                    className="!space-x-2 flex bg-indigo-500/20 !p-1.5 rounded-md border border-indigo-500/20 w-fit"
                  >
                    <div className="flex items-center !gap-2">
                      <span className=" text-dark/90">سمت :</span>
                    </div>
                    <p>{data?.positionCode?.title || "_"}</p>
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="basis-1/2 w-full flex justify-center">
            <MainGallery image={data?.image} gallery={data?.gallery} />
          </div>
        </div>
      </div>
      {/* دارایی */}
      <div className="flex flex-col gap-4 basis-1/3 !p-5">
        <div className="flex flex-col gap-4">
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
        {/* دارایی */}
        <div className="flex flex-col gap-4 border-t border-neutral-200 !pt-4">
          <h3 className="text-dark/90">وسائل نقلیه در اختیار</h3>
          <div className="h-full">
            <div className="!space-y-3">
              {data?.vehicle?.length < 1 ? (
                <span>موردی یافت نشد.</span>
              ) : (
                data?.vehicle?.map((vehicle) => (
                  <VehicleCard vehicle={vehicle} key={vehicle.vin} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEmployee;
