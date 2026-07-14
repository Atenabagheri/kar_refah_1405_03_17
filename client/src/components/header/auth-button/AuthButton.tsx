import { Link } from "react-router";
import { PiSignInFill, PiSignOutFill } from "react-icons/pi";
import { useEffect, useRef, useState } from "react";
import SubTopicHeader from "../navbar/SubTopicHeader";
import type { NavSubLink } from "../../../types/types";
import { useAppSelector } from "../../../redux/hooks";
// import { signout } from "../../../redux/slices/auth/AuthSlice";
import SignOutAlert from "../../../ui/SignOutAlert";

const AuthButton = () => {
  // const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const sub: NavSubLink[] = [
    { title: "پروفایل", path: "/me/profile" },
    {
      title: "تغییر کلمه عبور",
      path: "/me/change-password",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);
  // const signoutHandle = async () => {
  //   setIsOpen(false);
  //   const res = await dispatch(signout());
  //   if ("meta" in res) {
  //     if (res.meta.requestStatus === "fulfilled") {
  //       navigate(0);
  //     }
  //   }
  // };
  return (
    <div className="rounded-md cursor-pointer">
      {showAlert && <SignOutAlert setShow={setShowAlert} />}
      {user?.nationalId ? (
        <div ref={menuRef} className="relative !p-1.5">
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 text-light cursor-pointer"
          >
            {/* <PiUserCircle className="text-2xl" /> */}
            <span className="">{user?.firstName + " " + user?.lastName}</span>
          </div>
          {isOpen && (
            <SubTopicHeader
              setIsOpen={setIsOpen}
              sub={sub}
              className={"left-0 !w-[110px] top-9"}
            >
              <button
                className="whitespace-nowrap cursor-pointer text-danger flex gap-1 items-center"
                onClick={() => setShowAlert(true)}
              >
                <PiSignOutFill className="text-lg" />
                <span className="text-sm">خروج</span>
              </button>
            </SubTopicHeader>
          )}
        </div>
      ) : (
        <Link
          to={"/auth/login"}
          className="flex text-light items-center gap-1 !p-2"
        >
          <PiSignInFill className="text-2xl" />
          <span>ورود</span>
        </Link>
      )}
    </div>
  );
};

export default AuthButton;
