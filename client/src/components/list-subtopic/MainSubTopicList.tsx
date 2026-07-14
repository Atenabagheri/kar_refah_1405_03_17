import { Outlet, useParams } from "react-router";
import NotFound from "../../pages/NotFound";
import MainEmployeeList from "./list-employee/MainEmployeeList";
import MainBuildingList from "./list-building/MainBuildingList";
import MainMeterList from "./list-meter/MainMeterList";
import MainPositionList from "./list-position/MainPositionList";
import MainAssetList from "./list-asset/MainAssetList";
import MainListVehicle from "./list-vehicle/MainListVehicle";

const MainSubTopicList = () => {
  const { topic, subtopic, id } = useParams();

  if (id) return <Outlet />;

  if (topic !== "general" && topic !== "support") return <NotFound />;
  if (topic === "general")
    return (
      (subtopic === "employee" && <MainEmployeeList />) ||
      (subtopic === "position" && <MainPositionList />) ||
      (subtopic === "asset" && <MainAssetList />) || <NotFound />
    );
  else if (topic === "support")
    return (
      (subtopic === "energy" && <MainMeterList />) ||
      (subtopic === "buildings" && <MainBuildingList />) ||
      (subtopic === "vehicle" && <MainListVehicle />) || <NotFound />
    );
};

export default MainSubTopicList;
