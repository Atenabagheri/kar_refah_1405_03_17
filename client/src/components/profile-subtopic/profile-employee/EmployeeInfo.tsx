import type { ReactNode } from "react";

interface PropsType {
  title: string;
  value: string | undefined;
  icon?: ReactNode;
}
const EmployeeInfo = ({ title, icon, value }: PropsType) => {
  return (
    <div className="!space-x-2 flex">
      <div className="flex items-start !gap-2">
        {icon}
        <span className="text-dark/90 whitespace-nowrap">{title} :</span>
      </div>
      <p>{value}</p>
    </div>
  );
};

export default EmployeeInfo;
