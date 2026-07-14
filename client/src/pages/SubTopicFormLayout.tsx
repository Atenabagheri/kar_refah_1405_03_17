import { Outlet, useParams } from "react-router";
import { useAppSelector } from "../redux/hooks";
import LoadingTopic from "../LoadingTopic";
import AccessDenied from "./AccessDenied";
import NotFound from "./NotFound";

const SubTopicFormLayout = () => {
  const { form, subform } = useParams();
  const { loadingUser, user } = useAppSelector((state) => state.auth);

  if (!form || !subform) return <NotFound />;
  return loadingUser ? (
    <LoadingTopic />
  ) : user?.isAdmin ? (
    <Outlet />
  ) : (
    <AccessDenied />
  );
};

export default SubTopicFormLayout;
