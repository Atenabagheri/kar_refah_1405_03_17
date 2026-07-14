import { Outlet } from "react-router";
import AccessDenied from "../../pages/AccessDenied";
import { useAppSelector } from "../../redux/hooks";

const MainLogs = () => {
  const { user } = useAppSelector((state) => state.auth);
  return user?.roles === "MHQO" ? <Outlet /> : <AccessDenied />;
};

export default MainLogs;
