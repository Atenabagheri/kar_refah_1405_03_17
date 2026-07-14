import { useAppSelector } from "../../redux/hooks";
import LoadingTopic from "../../LoadingTopic";
import AccessDenied from "../AccessDenied";
import { Outlet, useLocation } from "react-router";
import NotFound from "../NotFound";

const DashboardLayout = () => {
  const { loadingUser, user } = useAppSelector((state) => state.auth);
  const pathname = useLocation();
  if (
    pathname.pathname.endsWith("/dashboard") ||
    pathname.pathname.endsWith("/dashboard/")
  )
    return <NotFound />;

  return loadingUser ? (
    <LoadingTopic />
  ) : user?.roles === "EHQO" ||
    user?.roles === "MHQO" ||
    user?.roles === "EPO" ||
    user?.roles === "MPO" ? (
    <Outlet />
  ) : (
    <AccessDenied />
  );
};

export default DashboardLayout;
