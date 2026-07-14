import { Outlet, useParams } from "react-router";
import { useAppSelector } from "../redux/hooks";
import LoadingTopic from "../LoadingTopic";
import AccessDenied from "./AccessDenied";
import NotFound from "./NotFound";

const SubTopicLayout = () => {
  const { subtopic } = useParams();
  const { loadingUser, user } = useAppSelector((state) => state.auth);
  if (!subtopic) return <NotFound />;
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

export default SubTopicLayout;
