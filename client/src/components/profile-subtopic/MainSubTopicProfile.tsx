import NotFound from "../../pages/NotFound";
import { useParams } from "react-router";
import MainProfileBuilding from "./profile-building/MainProfileBuilding";
import MainProfileRoom from "./profile-room/MainProfileRoom";
import MainProfileEmployee from "./profile-employee/MainProfileEmployee";
import MainProfilePosition from "./profile-position/MainProfilePosition";
import MainProfileAsset from "./profile-asset/MainProfileAsset";
import MainProfileVehicle from "./profile-vehicle/MainProfileVehicle";

const MainSubTopicProfile = () => {
  const { topic, subtopic } = useParams();
  return topic === "support" && subtopic === "buildings" ? (
    <MainProfileBuilding />
  ) : topic === "support" && subtopic === "vehicle" ? (
    <MainProfileVehicle />
  ) : topic === "support" && subtopic === "rooms" ? (
    <MainProfileRoom />
  ) : topic === "general" && subtopic === "employee" ? (
    <MainProfileEmployee />
  ) : topic === "general" && subtopic === "position" ? (
    <MainProfilePosition />
  ) : topic === "general" && subtopic === "asset" ? (
    <MainProfileAsset />
  ) : (
    <NotFound />
  );
};

export default MainSubTopicProfile;
