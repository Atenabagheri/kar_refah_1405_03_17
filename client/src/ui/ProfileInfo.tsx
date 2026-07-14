import type { ReactNode } from "react";

interface PropsType {
  title: string;
  value: string | number | undefined;
  icon?: ReactNode;
  en?: boolean;
  fontSize?: number;
}

const ProfileInfo = ({
  title,
  icon,
  value,
  en = false,
  fontSize = 16,
}: PropsType) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-start !gap-2">
        {icon}
        <span className={`text-dark/70 whitespace-nowrap text-sm`}>
          {title} :
        </span>
      </div>
      <p style={{ fontSize }} className={`${en && "font-sans"}`}>
        {value}
      </p>
    </div>
  );
};

export default ProfileInfo;
