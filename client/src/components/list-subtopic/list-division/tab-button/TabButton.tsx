import { Link, useLocation } from "react-router";

const TabButton = () => {
  const { pathname } = useLocation();
  return (
    <div className="flex gap-0 rounded-full w-[200px] border border-primary overflow-hidden">
      <Link
        to={"/human-resources/unit-position/map"}
        className={`${pathname === "/human-resources/unit-position/map" && "bg-primary text-white"} !p-1 flex items-center justify-center w-1/2 text-sm`}
      >
        کشوری
      </Link>
      <Link
        to={"/headquarter/division/list"}
        className={`${pathname === "/headquarter/division/list" && "bg-primary text-white"} !p-1 flex items-center justify-center w-1/2 text-sm`}
      >
        ستادی
      </Link>
    </div>
  );
};

export default TabButton;
