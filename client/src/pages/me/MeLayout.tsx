import { Outlet, useLocation } from "react-router";
import { useAppSelector } from "../../redux/hooks";
import NotFound from "../NotFound";
import LoadingTopic from "../../LoadingTopic";
import MainSideBar from "../../components/me/side-bar/MainSideBar";

const MeLayout = () => {
  const _appSignging = localStorage.getItem("_appSignging");
  const { loadingUser, user } = useAppSelector((state) => state.auth);

  const pathname = useLocation();
  if (
    pathname.pathname.endsWith("/me") ||
    pathname.pathname.endsWith("/me/")
  )
    return <NotFound />;

  return loadingUser ? (
    <LoadingTopic />
  ) : _appSignging && user?.nationalId ? (
    <div className="flex h-full">
      <MainSideBar />
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  ) : (
    <NotFound />
  );
};

export default MeLayout;
