import { Link, useLocation } from "react-router";

const TabButton = () => {
  const { pathname } = useLocation();
  return (
    <div className="flex gap-0 rounded-full w-[200px] border border-primary overflow-hidden">
      <Link
        to={"/dashboard/province"}
        className={`${pathname === "/dashboard/province" && "bg-primary text-white"} !p-1 flex items-center justify-center w-1/2 text-sm`}
      >
        استانی
      </Link>
      <Link
        to={"/dashboard/hqs"}
        className={`${pathname === "/dashboard/hqs" && "bg-primary text-white"} !p-1 flex items-center justify-center w-1/2 text-sm`}
      >
        ستادی
      </Link>
    </div>
  );
};

export default TabButton;
