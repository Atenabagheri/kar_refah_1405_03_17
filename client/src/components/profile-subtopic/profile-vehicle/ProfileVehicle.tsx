import {
  PiCarDuotone,
  PiCaretLeft,
  PiUserDuotone,
  PiVanDuotone,
} from "react-icons/pi";
import ProfileInfo from "../../../ui/ProfileInfo";
import { Link, useNavigate } from "react-router";
import LicensePlate from "../../../ui/LicensePlate";
import MainVehicleTab from "./MainVehicleTab";
import { useAppSelector } from "../../../redux/hooks";
import MainGallery from "../../../ui/gallery/MainGallery";
import DeleteButton from "../../../ui/DeleteButton";

const ProfileVehicle = () => {
  const { data } = useAppSelector((state) => state.vehicle);
  const { user } = useAppSelector((state) => state.auth);

  const vehicle = data?.vehicle;

  const navigate = useNavigate();

  const backHandler = () => {
    navigate(-1);
  };

  return (
    <div className="!p-4 flex">
      <div className="flex flex-col gap-4 w-2/3">
        <div className="flex items-start justify-between !p-5">
          <div className="flex flex-col gap-4 w-full">
            <div className="text-lg flex items-center !gap-4">
              <PiCarDuotone className="text-3xl" />
              <h3>اطلاعات خودرو</h3>
            </div>
            <div className="border-r border-r-secondary/15 !pr-5 !mr-3 !space-y-4">
              <div className="flex items-center gap-2">
                <ProfileInfo title="نوع" value={vehicle?.vehicleType?.faName} />
                {user?.isAdmin && (
                  <DeleteButton
                    title={`خودرو با شماره شاسی ${vehicle?.vin}`}
                    origin="profile"
                    url={`/api/vehicle/delete-vehicle/${vehicle?.vin}`}
                  />
                )}
              </div>
              <ProfileInfo title="مدل" value={vehicle?.model} />
              <div className="flex items-center gap-2">
                <span>پلاک:</span>
                {vehicle?.licensePlate && (
                  <LicensePlate licensePlate={vehicle?.licensePlate} />
                )}
              </div>
              <ProfileInfo
                title="شماره شاسی(VIN)"
                value={vehicle?.vin}
                fontSize={18}
                en
              />
              <ProfileInfo
                title="شماره موتور"
                value={vehicle?.engineNumber}
                fontSize={18}
                en
              />
            </div>

            {/* بهره بردار */}
            <div className="!space-y-4 !p-5">
              <div className="text-lg flex items-center !gap-4">
                <PiUserDuotone className="text-3xl" />
                <h3>بهره‌بردار</h3>
              </div>
              <div>
                {!vehicle?.operatorType ? (
                  <span>موردی یافت نشد.</span>
                ) : vehicle?.operatorType === "special" ? (
                  <Link
                    to={`/general/employee/${vehicle?.operatorSpecial?.nationalId}`}
                    className="!space-x-2 flex bg-indigo-500/20 !p-1.5 rounded-md border border-indigo-500/20 w-fit"
                  >
                    <div className="flex items-center gap-2">
                      <span className=" text-dark/90">نام :</span>
                      <span>
                        {vehicle?.operatorSpecial?.firstName +
                          " " +
                          vehicle?.operatorSpecial?.lastName}
                      </span>
                      <span className="text-sm text-neutral-500">
                        (
                        {vehicle?.operatorSpecial?.positionCode?.title ||
                          "نامشخص"}
                        )
                      </span>
                    </div>
                  </Link>
                ) : vehicle?.operatorType === "general" ? (
                  <div className="!space-x-2 flex bg-indigo-500/20 !p-1.5 rounded-md border border-indigo-500/20 w-fit">
                    <div className="flex items-center gap-2">
                      <span className=" text-dark/90">بخش :</span>
                      <span>{vehicle?.operatorGeneral.faName}</span>
                    </div>
                  </div>
                ) : (
                  <span className=" text-dark/90">نامشخص</span>
                )}
              </div>
            </div>
            {/* راننده */}
            <div className="!space-y-4 !p-5">
              <div className="text-lg flex items-center !gap-4">
                <PiVanDuotone className="text-3xl" />
                <h3>راننده</h3>
              </div>
              <div>
                {vehicle?.wheelman ? (
                  <Link
                    to={`/general/employee/${vehicle?.wheelman?.nationalId}`}
                    className="!space-x-2 flex bg-indigo-500/20 !p-1.5 rounded-md border border-indigo-500/20 w-fit"
                  >
                    <div className="flex items-center gap-2">
                      <span className=" text-dark/90">نام :</span>
                      <span>
                        {vehicle?.wheelman?.firstName +
                          " " +
                          vehicle?.wheelman?.lastName}
                      </span>
                    </div>
                  </Link>
                ) : (
                  <span className="text-dark/90">نامشخص</span>
                )}
              </div>
            </div>
          </div>
          {/* image */}
          <MainGallery image={vehicle?.image} gallery={vehicle?.gallery} />
        </div>
      </div>
      <div className="w-1/3 !space-y-4">
        <button
          onClick={backHandler}
          className="flex items-center gap-1 cursor-pointer !mr-auto"
        >
          <span>بازگشت</span>
          <PiCaretLeft />
        </button>
        <MainVehicleTab />
      </div>
    </div>
  );
};

export default ProfileVehicle;
