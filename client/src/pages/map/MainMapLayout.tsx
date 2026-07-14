import { Outlet, useParams } from "react-router";
import MainUnitPositionMap from "../../components/profile-subtopic/unit-position-map/MainUnitPositionMap";

const MainMapLayout = () => {
  const { province } = useParams();
  return province ? <Outlet /> : <MainUnitPositionMap />;
};

export default MainMapLayout;
