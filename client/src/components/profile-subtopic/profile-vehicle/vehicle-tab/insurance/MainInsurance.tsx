import { useAppSelector } from "../../../../../redux/hooks";
import SingleInsurance from "./SingleInsurance";

const MainInsurance = () => {
  const { data } = useAppSelector((state) => state.vehicle);

  const insurance = data?.insurance;

  return insurance?.map((ins) => (
    <SingleInsurance
      key={ins.insuranceCode}
      insurance={ins}
    />
  ));
};

export default MainInsurance;
