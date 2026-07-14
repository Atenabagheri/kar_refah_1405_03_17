import { PiBriefcaseDuotone, PiCaretLeft } from "react-icons/pi";
import type { PositionType } from "../../../types/types";
import { useNavigate } from "react-router";
import PositonInfo from "./PositonInfo";
import PositionEmployeeCard from "./PositionEmployeeCard";
import DeleteButton from "../../../ui/DeleteButton";
import { useAppSelector } from "../../../redux/hooks";

interface PropsType {
  data: PositionType;
}

const ProfilePosition = ({ data }: PropsType) => {
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
        <div className="flex flex-col gap-4">
          <div className="text-lg flex items-center !gap-4">
            <PiBriefcaseDuotone className="text-3xl" />
            <h3>اطلاعات سمت</h3>
          </div>
          {/* {data?.maxEmployees < data?.employee?.length && (
            <div className="bg-danger/10 border border-danger rounded-md !p-2 w-fit">
              <p className="text-danger text-sm">
                اخطار: به این سمت فقط{" "}
                <span className="text-base text-black underline underline-offset-4 !px-1">
                  {data?.maxEmployees === 1 ? "یک" : data?.maxEmployees}
                </span>{" "}
                پرسنل می توان اختصاص داد
              </p>
            </div>
          )} */}
          <div className="border-r border-r-secondary/30 !pr-5 !mr-3 !space-y-4">
            <div className="flex items-center gap-2">
              <PositonInfo title="عنوان" value={data?.title} />
              {user?.isAdmin && (
                <DeleteButton
                  title={`سمت ${data?.title}`}
                  origin="profile"
                  url={`/api/position/delete-position/${data?.code}`}
                />
              )}
            </div>
            <PositonInfo title="کد" value={data?.code} />
            <PositonInfo title="ظرفیت" value={data?.maxEmployees} />
            {/* <PositonInfo
              title="تعداد افراد حاضر در این سمت"
              value={`${data?.employee?.length} از ${data?.maxEmployees}`}
            /> */}

            <PositonInfo title="توضیحات" value={data?.description} />
          </div>
        </div>
      </div>

      {/* افراد */}
      <div className="flex flex-col gap-4 basis-1/3 !p-5">
        <h3 className="text-dark/90">افراد</h3>
        <div className="h-full">
          <div className="!space-y-3">
            {data?.employee?.length < 1 ? (
              <span>موردی یافت نشد.</span>
            ) : (
              <div className="grid gap-2 grid-cols-1 xl:grid-cols-2">
                {data?.employee?.map((employee) => (
                  <PositionEmployeeCard
                    key={employee?.nationalId}
                    employee={employee}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePosition;
