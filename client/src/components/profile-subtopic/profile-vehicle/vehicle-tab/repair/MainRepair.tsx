import { useAppSelector } from "../../../../../redux/hooks";
import SingleMaintenance from "./SingleMaintenance";

const MainRepair = () => {
    const { data } = useAppSelector((state) => state.vehicle);

  const maintenance = data?.maintenance;

  return maintenance?.map((ma) => (
    <SingleMaintenance key={ma.financialDocumentNumber} maintenance={ma} />
  ));
};

export default MainRepair;
