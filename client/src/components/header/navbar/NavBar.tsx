import { Link } from "react-router";
import { useAppSelector } from "../../../redux/hooks";
import type { NavLink } from "../../../types/types";
import TopicHeader from "./TopicHeader";
import { PiHouseFill } from "react-icons/pi";

export default function NavBar() {
  const { user } = useAppSelector((state) => state.auth);
  const navLinks: NavLink[] = [
    // {
    //   isAccess: true,
    //   title: "منابع انسانی",
    //   path: `/human-resources`,
    //   sub: [
    //     {
    //       title: "واحد اداری",
    //       path: `/human-resources/unit-position/map`,
    //     },
    //   ],
    // },
    {
      isAccess: user?.isAdmin || typeof user?.roles === "string",
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
      isAccess: user?.roles === "MHQO",
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
      path: `/form`,
      headline: [
        {
          title: "فرم‌های عمومی",
          sub: [
            { title: "استان", path: `/form/general/province` },
            { title: "شهرستان", path: `/form/general/county` },
            { title: "شهر", path: `/form/general/city` },
            { title: "تاریخ", path: `/form/general/date-category` },
          ],
        },
        {
          title: "فرم‌های منابع انسانی",
          sub: [
            {
              title: "ایجاد واحد اداری",
              path: `/form/hr/unit-position`,
            },
          ],
        },
        {
          title: "فرم‌های ساختمان",
          sub: [
            { title: "فرم ساختمان", path: `/form/building/profile` },
            { title: "فرم اتاق", path: `/form/building/room` },
          ],
        },
        {
          title: "فرم‌های سمت",
          sub: [{ title: "شناسنامه سمت", path: `/form/position/profile` }],
        },
        {
          title: "فرم‌های پرسنل",
          sub: [{ title: "شناسنامه پرسنل", path: `/form/employee/profile` }],
        },
        {
          title: "فرم‌های خودرو",
          sub: [
            { title: "شناسنامه خودرو", path: `/form/vehicle/profile` },
            { title: "فرم بیمه", path: `/form/vehicle/insurance` },
          ],
        },
        {
          title: "فرم‌های انرژی",
          sub: [
            { title: "شناسنامه کنتور آب", path: `/form/water/water-meter` },
            { title: "فرم قبض آب", path: `/form/water/water-bill` },
            { title: "شناسنامه کنتور گاز", path: `/form/gas/gas-meter` },
            { title: "فرم قبض گاز", path: `/form/gas/gas-bill` },
            {
              title: "شناسنامه کنتور برق",
              path: `/form/electricity/electricity-meter`,
            },
            { title: "فرم فاکتور گازوئیل", path: `/form/diesel/profile` },
          ],
        },
      ],
    },
  ];
  return (
    <div className="hidden md:flex items-center gap-6 w-auto h-full">
      <div className="w-auto h-full md:flex items-center justify-center">
        <img
          src="/assets/images/logo1.svg"
          alt="وزارت تعاون، کار و رفاه اجتماعی"
          width={192}
          height={60}
          className="h-[95%] 2xl:h-full w-auto"
        />
      </div>
      <nav className="flex items-center gap-8">
        <Link
          className={`whitespace-nowrap text-white flex items-center gap-1`}
          to="/"
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
          >
            داشبورد
          </Link>
        )}

        <ul className="flex items-center gap-8">
          {navLinks?.map((navLink, index) => (
            <TopicHeader key={index} {...navLink} />
          ))}
        </ul>
      </nav>
    </div>
  );
}
