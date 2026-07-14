import { Outlet, useParams } from "react-router";
import MainFormSubTopic from "../../components/form-subtopic/MainFormSubTopic";

const FormSubtopicLayout = () => {
  const { name } = useParams();
  return name ? <Outlet /> : <MainFormSubTopic />;
};

export default FormSubtopicLayout;
