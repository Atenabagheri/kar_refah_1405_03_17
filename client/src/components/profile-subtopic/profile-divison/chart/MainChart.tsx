import type { HeadquarterSectionsType } from "../../../../types/types";
import MyLegend from "./MyLegend";
import MyPieChart from "./MyPieChart";

interface PropsType {
  total: HeadquarterSectionsType;
}

const MainChart = ({ total }: PropsType) => {
  const pieChartData = [
    { name: "معاونت", value: total?.sectionDeputy, color: "#FFC9C9" },
    { name: "مرکز", value: total?.sectionCenter, color: "#FFD7A8" },
    { name: "اداره کل", value: total?.sectionGeneral, color: "#BEDBFF" },
    { name: "دفتر", value: total?.sectionOffice, color: "#DDD6FF" },
    { name: "مدیریت", value: total?.sectionManagement, color: "#B9F8CF" },
    { name: "اداره/گروه", value: total?.sectionDepartment, color: "#E7E5E4" },
  ];
  return (
    <div className="flex gap-20 items-center">
      <div className="!space-y-2">
        {pieChartData?.map((p) => (
          <MyLegend key={p?.name} name={p?.name} color={p?.color} />
        ))}
      </div>
      <MyPieChart data={pieChartData} />
    </div>
  );
};

export default MainChart;
