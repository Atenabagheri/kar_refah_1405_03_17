import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";

interface PropsType {
  title: string;
  path: string;
  icon?: ReactNode;
}

const SideBarLink = ({ title, path, icon }: PropsType) => {
  const pathName = useLocation().pathname;
  return (
    <Link to={path}>
      <div
        className={`${pathName === path && "bg-secondary/10"} border-b border-secondary/30 !p-2.5 flex items-center gap-3`}
      >
        <span>{icon}</span>
        <span className="text-sm">{title}</span>
      </div>
    </Link>
  );
};

export default SideBarLink;
