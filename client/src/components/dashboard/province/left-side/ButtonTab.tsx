import type React from "react";
import type { TabType } from "./MainLeftSide";

type PropsType = {
  title: string;
  tabMenu: TabType;
  setTabMenu: React.Dispatch<React.SetStateAction<TabType>>;
  active: TabType;
  text?: string;
  icon?: React.ReactNode;
};
const ButtonTab = ({
  tabMenu,
  setTabMenu,
  title,
  active,
  text,
  icon,
}: PropsType) => {
  const handleClick = () => {
    setTabMenu(active);
  };
  return (
    <button
      onClick={handleClick}
      className={`!p-4 cursor-pointer text-neutral-800 text-sm rounded-xl shadow-md flex items-center gap-1 whitespace-nowrap bg-secondary/10 ${active === tabMenu && "bg-white"}`}
    >
      {icon && <div className="text-xl">{icon}</div>}
      {title} {text}
    </button>
  );
};

export default ButtonTab;
