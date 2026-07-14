import {
  PiSignOutFill,
  PiUserDuotone,
  PiLockSimpleOpenDuotone,
  PiListMagnifyingGlassDuotone,
  PiGearSixDuotone,
} from "react-icons/pi";
import SideBarLink from "./SideBarLink";
import { useState } from "react";
import SignOutAlert from "../../../ui/SignOutAlert";
import { useAppSelector } from "../../../redux/hooks";

const MainSideBar = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [show, setShow] = useState<boolean>(false);

  const links = [
    {
      isAccess: true,
      title: "اطلاعات من",
      path: "/me/profile",
      icon: <PiUserDuotone className="text-xl" />,
    },
    {
      isAccess: true,
      title: "تغییر کلمه عبور",
      path: "/me/change-password",
      icon: <PiLockSimpleOpenDuotone className="text-xl" />,
    },
    {
      isAccess: user?.isAdmin,
      title: "تنظیمات",
      path: "/me/settings",
      icon: <PiGearSixDuotone className="text-xl" />,
    },
    {
      isAccess: user?.isAdmin,
      title: "لاگ ها",
      path: "/me/logs/auth",
      icon: <PiListMagnifyingGlassDuotone className="text-xl" />,
    },
  ];
  return (
    <>
      {show && <SignOutAlert setShow={setShow} />}
      <div className="w-[170px] border-l border-secondary/30 flex flex-col">
        {links?.map(
          (link, index) =>
            link.isAccess && (
              <SideBarLink
                key={index}
                title={link?.title}
                path={link?.path}
                icon={link?.icon}
              />
            )
        )}
        <div
          onClick={() => setShow(true)}
          className={`border-b border-secondary/30 !p-2.5 flex items-center gap-3 text-danger cursor-pointer`}
        >
          <PiSignOutFill className="text-xl" />
          <span className="text-sm">خروج</span>
        </div>
      </div>
    </>
  );
};

export default MainSideBar;
