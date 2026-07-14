import { Link, useParams } from "react-router";
import { useAppSelector } from "../../redux/hooks";
import TabButton from "./tab-button/TabButton";
import MainDashboardProvince from "./province/MainDashboardProvince";
import MainDashboardHeadquarters from "./headquarters/MainDashboardHeadquarters";
import NotFound from "../../pages/NotFound";

const MainDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const params = useParams();
  const type = params.type;

  const MHQO = user?.roles === "MHQO";

  if (type !== "province" && (!MHQO || type !== "hqs")) return <NotFound />;
  return (
    <main className="w-full h-full flex flex-col gap-4 !p-2 md:!p-4">
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between w-full">
        <Link
          to="/me/profile"
          className="bg-primary/10 rounded-md !p-2 text-primary border border-primary/50"
        >
          {user?.firstName + " " + user?.lastName + " خوش آمدید."}
        </Link>
        {MHQO && <TabButton />}
      </div>
      {type === "province" && <MainDashboardProvince />}
      {MHQO && type === "hqs" && <MainDashboardHeadquarters />}
    </main>
  );
};

export default MainDashboard;
