import type { ReactNode } from "react";

interface PropsType {
  title: string;
  value: string | number;
  icon?: ReactNode;
}

const PositonInfo = ({ title, icon, value }: PropsType) => {
  return (
    <div className="!space-x-2 flex">
      <div className="flex items-center !gap-2">
        {icon}
        <span className="text-dark/90">{title} :</span>
      </div>
      <p>{value}</p>
    </div>
  );
};

export default PositonInfo;
