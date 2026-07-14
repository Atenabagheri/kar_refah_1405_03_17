import { Outlet, useParams } from "react-router";
import MainProfileSubTopic from "../../components/profile-subtopic/MainSubTopicProfile";

const SubTopicProfileLayout = () => {
  const { name } = useParams();
  console.log(name)
  return name ? <Outlet /> : <MainProfileSubTopic />;
};

export default SubTopicProfileLayout;
