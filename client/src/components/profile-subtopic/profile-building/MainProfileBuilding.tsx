import ProfileBuilding from "./ProfileBuilding";
import { useAppSelector } from "../../../redux/hooks";
import AccessDenied from "../../../pages/AccessDenied";

const MainProfileBuilding = () => {
  const { user } = useAppSelector((state) => state.auth);

  return user?.roles === "MHQO" || user?.roles === "MPO" ? (
    <ProfileBuilding />
  ) : (
    <AccessDenied />
  );
};

export default MainProfileBuilding;
