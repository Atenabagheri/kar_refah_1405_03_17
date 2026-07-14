import { PiPersonSimpleSwimDuotone } from "react-icons/pi";
import { useAppSelector } from "../../../../../redux/hooks";

const MainProvinceDashboardSportsBuilding = () => {
  const { data } = useAppSelector((state) => state.provinceDashboard);

  const sportsBuildings = data?.sportsBuildings;
  return (
    <div>
      <div className="flex items-center justify-between w-full border-b border-b-neutral-400 !p-2">
        <div className="flex items-center gap-1 text-2xl text-neutral-800">
          <PiPersonSimpleSwimDuotone />
          <h3 className="text-sm">
            مجموعه های فرهنگی ورزشی {data?.info.faName}
          </h3>
        </div>
      </div>
      <div>
        {sportsBuildings?.length === 0 ? (
          <p className="!p-4 text-center text-dark">موردی یافت نشد!</p>
        ) : (
          <div className="flex flex-col gap-0">
            <div className="flex items-center gap-0 !p-4 border-b border-b-dark/10">
              <span className="basis-1/2 text-dark/80">نام مجموعه</span>
              <span className="basis-1/2 text-dark/80">کد پستی</span>
            </div>
            {sportsBuildings?.map((build) => (
            <div key={build.postalCode} className="flex items-center justify-between !p-4 even:bg-dark/5">
              <span className="basis-1/2 text-dark">{build.name}</span>
              <span className="basis-1/2 text-dark">{build.postalCode}</span>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainProvinceDashboardSportsBuilding;
