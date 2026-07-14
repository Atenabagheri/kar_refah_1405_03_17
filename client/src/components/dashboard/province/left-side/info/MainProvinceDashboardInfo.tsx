import SingleCartInfo from "../SingleCartInfo";
import { useAppSelector } from "../../../../../redux/hooks";

const MainProvinceDashboardInfo = () => {
  const { data } = useAppSelector((state) => state.provinceDashboard);

  return (
    <div>
      <SingleCartInfo
        data={[
          { title: "نام استان", value: data?.info?.faName },
          { title: "جمعیت", value: data?.info?.population },
          { title: "تعداد شهرستان", value: data?.info?.totalCounty },
        ]}
      />
    </div>
  );
};

export default MainProvinceDashboardInfo;
