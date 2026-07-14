import ProfileInfo from "../../../../../ui/ProfileInfo";
import { useAppSelector } from "../../../../../redux/hooks";
import { convertDateToFa } from "../../../../../helper/convertDateToFa";

const MainTechnical = () => {
  const { data } = useAppSelector((state) => state.vehicle);
  const vehicle = data?.vehicle;

  return (
    <div className="flex flex-col gap-4">
      <ProfileInfo title="برند" value={vehicle?.brand?.faName} />
      <ProfileInfo title="رنگ" value={vehicle?.color} />
      <ProfileInfo title="سال" value={vehicle?.year} />
      <ProfileInfo title="ظرفیت موتور" value={vehicle?.engineCapacity} />
      <ProfileInfo title="اسب بخار" value={vehicle?.horsepower} />
      <div className="flex items-center gap-2">
        <ProfileInfo title="کیلومتر خودرو" value={vehicle?.mileage} />
        <span className="text-neutral-500 text-sm">
          تا تاریخ: {vehicle?.updatedAt && convertDateToFa(vehicle?.updatedAt)}
        </span>
      </div>
      <ProfileInfo title="توضیحات" value={vehicle?.description} />
    </div>
  );
};

export default MainTechnical;
