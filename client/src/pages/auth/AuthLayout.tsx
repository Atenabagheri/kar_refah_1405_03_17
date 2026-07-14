import { Navigate, Outlet } from "react-router";

const AuthLayout = () => {
  const _appSignging = localStorage.getItem("_appSignging");
  return _appSignging ? <Navigate to={"/"} /> : <Outlet />;
};

export default AuthLayout;
