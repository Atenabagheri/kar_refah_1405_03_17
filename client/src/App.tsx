import { Route, Routes } from "react-router";
import NotFound from "./pages/NotFound";
import HomeLayout from "./pages/HomeLayout";
import LoginLayout from "./pages/auth/LoginLayout";
import AuthLayout from "./pages/auth/AuthLayout";
import ForgotLayout from "./pages/auth/ForgotLayout";
import Header from "./components/header/Header";
import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { getAccess, getMeInfo, signout } from "./redux/slices/auth/AuthSlice";
import Loading from "./Loading";
import MainLogAuth from "./components/log/auth/MainLogAuth";
import MainLogs from "./components/log/MainLogs";
import MeLayout from "./pages/me/MeLayout";
import MainMeProfile from "./components/me/MainMeProfile";
import MainChangePassword from "./components/me/MainChangePassword";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import MainSubTopicList from "./components/list-subtopic/MainSubTopicList";
import MainSubTopicProfile from "./components/profile-subtopic/MainSubTopicProfile";
import SubTopicLayout from "./pages/SubTopicLayout";
import MainDashboard from "./components/dashboard/MainDashboard";
import MainFormSubTopic from "./components/form-subtopic/MainFormSubTopic";
import SubTopicFormLayout from "./pages/SubTopicFormLayout";
import MainSetting from "./components/me/setting/MainSetting";

function App() {
  const { loadingToken, loadingUser, user } = useAppSelector(
    (state) => state.auth
  );

  const dispatch = useAppDispatch();
  const _appSignging = localStorage.getItem("_appSignging");

  const getAccessToken = useCallback(async () => {
    if (_appSignging) {
      const res = await dispatch(getAccess());
      if (res.meta.requestStatus === "fulfilled") {
        await dispatch(getMeInfo());
      } else {
        await dispatch(signout());
      }
    }
  }, [dispatch, _appSignging]);

  useEffect(() => {
    getAccessToken();
  }, [getAccessToken]);

  return loadingToken || loadingUser ? (
    <Loading />
  ) : (
    <>
      <Header />
      <div className="h-[92vh] overflow-y-auto">
        {user ? (
          // user auth
          <Routes>
            {/* home */}
            <Route index element={<HomeLayout />} />

            {/* me */}
            <Route path="me" element={<MeLayout />}>
              <Route path="profile" element={<MainMeProfile />} />
              <Route path="change-password" element={<MainChangePassword />} />
              <Route path="settings" element={<MainSetting />} />
              <Route path="logs" element={<MainLogs />}>
                <Route path="auth" element={<MainLogAuth />} />
              </Route>
            </Route>

            {/* forms */}
            <Route path="form" element={<SubTopicFormLayout />}>
              <Route
                path=":form/:subform"
                element={<MainFormSubTopic />}
              ></Route>
            </Route>

            {/* modules */}
            <Route path=":topic" element={<SubTopicLayout />}>
              <Route path=":subtopic" element={<MainSubTopicList />}>
                <Route path=":id" element={<MainSubTopicProfile />} />
              </Route>
            </Route>

            {/* dashboard */}
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route path=":type" element={<MainDashboard />} />
            </Route>

            {/* not found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        ) : (
          <Routes>
            <Route index element={<HomeLayout />} />
            <Route path="auth" element={<AuthLayout />}>
              <Route path="login" element={<LoginLayout />} />
              <Route path="forgot" element={<ForgotLayout />} />
            </Route>
            <Route path="*" element={<NotFound />} />
            {/* <Route
              path={`*`}
              element={
                <Navigate to={`/auth/login?backLink=${pathname || ""}`} />
              }
            /> */}
          </Routes>
        )}
      </div>
    </>
  );
}

export default App;
