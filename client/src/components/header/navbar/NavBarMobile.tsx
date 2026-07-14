import { Link } from "react-router";
import { useAppSelector } from "../../../redux/hooks";
import type { NavLink } from "../../../types/types";
import TopicHeader from "./TopicHeader";
import { PiHouseFill, PiList, PiX } from "react-icons/pi";
import { useState } from "react";

export default function NavBarMobile() {
  const { user } = useAppSelector((state) => state.auth);
  const [showMune, setShowMune] = useState<boolean>(false);
  const navLinks: NavLink[] = [
    {
      isAccess: true,
      title: "منابع انسانی",
      path: `/human-resources`,
      sub: [
        {
          title: "واحد اداری",
          path: `/human-resources/unit-position/map`,
        },
      ],
    },
    {
      isAccess: true,
      title: "پشتیبانی",
      path: `/support`,
      sub: [
        { title: "مصارف انرژی", path: `/support/energy?meter=electricity` },
        {
          title: "ساختمان‌ها",
          path: `/support/buildings`,
        },
        {
          title: "خودروها",
          path: `/support/vehicle`,
        },
      ],
    },
    {
      isAccess: true,
      title: "عمومی",
      path: `/general`,
      sub: [
        // { title: "استان", path: `/general/province/form` },
        // { title: "شهرستان", path: `/general/county/form` },
        // { title: "شهر", path: `/general/city/form` },
        // { title: "تاریخ", path: `/human-resources/date-category/form` },
        { title: "پرسنل", path: `/general/employee` },
        { title: "سمت", path: `/general/position` },
        { title: "دارایی", path: `/general/asset` },
      ],
    },
    {
      isAccess: user?.isAdmin,
      title: "فرم",
      path: `/forms`,
      headline: [
        {
          title: "فرم‌های عمومی",
          sub: [
            { title: "استان", path: `/forms/province/form` },
            { title: "شهرستان", path: `/forms/county/form` },
            { title: "شهر", path: `/forms/city/form` },
            { title: "تاریخ", path: `/forms/date-category/form` },
          ],
        },
        {
          title: "فرم‌های منابع انسانی",
          sub: [
            {
              title: "ایجاد واحد اداری",
              path: `/forms/unit-position/form`,
            },
          ],
        },
      ],
    },
  ];
  return (
    <div className="md:hidden">
      <button
        onClick={() => setShowMune(true)}
        className="flex items-center justify-center"
      >
        <PiList className="text-2xl text-white" />
      </button>
      {showMune && (
        <div className="fixed inset-0 flex items-center justify-center w-full h-full z-[999] backdrop-blur-md">
          <div className="fixed inset-0 bg-black/50 z-40"></div>
          <div className="z-50 flex flex-col gap-4 w-full h-full !p-4">
            <div className="flex items-center justify-between gap-4 border-b border-b-white/50 !pb-6">
              <div className="w-auto h-full flex items-center justify-center">
                <img
                  src="/assets/images/logo1.svg"
                  alt="وزارت تعاون، کار و رفاه اجتماعی"
                  width={192}
                  height={60}
                  className="h-12 w-full"
                />
              </div>
              <button onClick={() => setShowMune(false)}>
                <PiX className="text-2xl text-white mr-auto" />
              </button>
            </div>
            <nav className="flex flex-col gap-8 text-lg">
              <Link
                className={`whitespace-nowrap text-white flex items-center gap-1`}
                to="/"
                onClick={() => setShowMune(false)}
              >
                <PiHouseFill className="text-lg" />
                صفحه اصلی
              </Link>
              {(user?.roles === "EHQO" ||
                user?.roles === "MHQO" ||
                user?.roles === "EPO" ||
                user?.roles === "MPO") && (
                <Link
                  className={`whitespace-nowrap text-white flex items-center gap-1`}
                  to="/dashboard/province"
                  onClick={() => setShowMune(false)}
                >
                  داشبورد
                </Link>
              )}

              <ul className="flex flex-col gap-8">
                {navLinks?.map((navLink, index) => (
                  <TopicHeader key={index} {...navLink} />
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
