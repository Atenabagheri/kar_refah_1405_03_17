import { useNavigate } from "react-router";
import type { EmployeeType } from "../../../types/types";

interface PropsType {
  employee: EmployeeType;
}

const EmployeeCard = ({ employee }: PropsType) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/general/employee/${employee?.nationalId}`)}
      className="bg-warning/20 !p-2 rounded-md flex flex-col gap-2 cursor-pointer"
    >
      <div className="!space-x-1 flex">
        <span className="text-sm text-dark/80 font-semibold">نام :</span>
        <p
          className="text-sm truncate"
          title={(employee.firstName || "-") + " " + (employee?.lastName || "-")}
        >
          {(employee.firstName || "-") + " " + (employee?.lastName || "-")}
        </p>
      </div>
      <div className="!space-x-1">
        <span className="text-sm text-dark/80 font-semibold">کدملی :</span>
        <span className="text-sm">{employee?.nationalId}</span>
      </div>
      <div className="!space-x-1">
        <span className="text-sm text-dark/80 font-semibold">سمت :</span>
        <span className="text-sm">{employee?.positionCode?.title}</span>
      </div>
    </div>
  );
};

export default EmployeeCard;
