import { Link, useNavigate } from "react-router";
import type { AssetsType } from "../../../types/types";
import {
  PiCaretLeft,
  PiDoorDuotone,
  PiToolboxDuotone,
  PiUsersThreeDuotone,
} from "react-icons/pi";
import AssetInfo from "./AssetInfo";
import DeleteButton from "../../../ui/DeleteButton";
import { useAppSelector } from "../../../redux/hooks";

interface PropsType {
  data: AssetsType;
}

const ProfileAsset = ({ data }: PropsType) => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  return (
    <div className="flex relative">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 cursor-pointer absolute top-5 left-3"
      >
        <span>بازگشت</span>
        <PiCaretLeft />
      </button>

      <div className="flex flex-col basis-2/3 min-h-[92vh] border-l border-secondary/30">
        <div className="flex items-center justify-between !p-5">
          <div className="!space-y-8 basis-1/2 w-full">
            <div className="flex flex-col gap-4">
              <div className="text-lg flex items-center !gap-4">
                <PiToolboxDuotone className="text-3xl" />
                <span className="text-lg">اطلاعات دارایی</span>
              </div>
              <div className="border-r border-r-secondary/30 !pr-5 !mr-3 !space-y-4">
                <div className="flex items-center gap-2">
                  <AssetInfo title="عنوان" value={data?.name} />
                  {user?.isAdmin && (
                    <DeleteButton
                      title={`${data?.name} با کد اموال ${data?.serialNumber}`}
                      origin="profile"
                      url={`/api/asset/delete-asset/${data?.serialNumber}`}
                    />
                  )}
                </div>
                <AssetInfo title="شماره سریال" value={data?.serialNumber} />
                <AssetInfo title="دسته‌بندی" value={data?.category?.name} />
                <AssetInfo title="توضیحات" value={data?.description} />
              </div>
            </div>
          </div>
          {/* image */}
          <img
            src="/assets/images/not-found.png"
            alt="not-found"
            className="w-[200px] h-[200px] rounded-md"
          />
        </div>
        {/* کارمند */}
        <div className="!space-y-4 !p-5">
          <div className="text-lg flex items-center !gap-4">
            <PiUsersThreeDuotone className="text-3xl" />
            <h3>کارمند</h3>
          </div>
          <div>
            {!data?.employee ? (
              <span>موردی یافت نشد.</span>
            ) : (
              <Link
                to={`/general/employee/${data?.employee?.nationalId}`}
                className="!space-x-2 flex bg-indigo-500/20 !p-1.5 rounded-md border border-indigo-500/20 w-fit"
              >
                <div className="flex items-center gap-2">
                  <span className=" text-dark/90">نام :</span>
                  <span>
                    {typeof data?.employee != "string" &&
                      data?.employee?.firstName +
                        " " +
                        data?.employee?.lastName}
                  </span>
                </div>
              </Link>
            )}
          </div>
        </div>
        {/* اتاق */}
        <div className="!space-y-4 !p-5">
          <div className="text-lg flex items-center !gap-4">
            <PiDoorDuotone className="text-3xl" />
            <h3>اتاق</h3>
          </div>
          <div>
            {!data?.roomNumber ? (
              <span>موردی یافت نشد.</span>
            ) : (
              <Link
                to={`/support/rooms/${data?.roomNumber?.number}`}
                className="!space-x-2 flex bg-purple-300/20 !p-1.5 rounded-md border border-purple-300/20 w-fit"
              >
                <div className="flex items-center gap-2">
                  <span className=" text-dark/90">نام :</span>
                  <span>{data?.roomNumber?.name}</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="basis-1/2"></div>
    </div>
  );
};

export default ProfileAsset;
