import { PiUserDuotone, PiBriefcaseDuotone } from "react-icons/pi";
import { useAppSelector } from "../../redux/hooks";
import ProfileInfo from "../../ui/ProfileInfo";

const MainMeProfile = () => {
  const { user } = useAppSelector((state) => state.auth);
  console.log(user);
  return (
    user && (
      <div className="!p-4 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="text-lg flex items-center !gap-4">
            <PiUserDuotone className="text-3xl" />
            <h3>اطلاعات شخصی</h3>
          </div>
          <div className="border-r border-r-secondary/15 !pr-5 !mr-3 !space-y-4">
            <ProfileInfo
              title="نام"
              value={user?.firstName + " " + user?.lastName}
            />
            <ProfileInfo title="کدملی" value={user?.nationalId} />
            <ProfileInfo title="شماره موبایل" value={user?.phone} />
            <ProfileInfo title="آدرس" value={user?.address} />
            <ProfileInfo title="استان" value={user?.province?.faName} />
            <ProfileInfo title="شهرستان" value={user?.county?.faName} />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="text-lg flex items-center !gap-4">
            <PiBriefcaseDuotone className="text-3xl" />
            <h3>اطلاعات شغلی</h3>
          </div>
          <div className="border-r border-r-secondary/15 !pr-5 !mr-3 !space-y-4">
            <ProfileInfo title="شغل" value={user?.positionCode?.title || "_"} />
            <ProfileInfo title="اتاق" value={user?.roomNumber?.name || "_"} />
          </div>
        </div>
      </div>
    )
  );
};

export default MainMeProfile;
