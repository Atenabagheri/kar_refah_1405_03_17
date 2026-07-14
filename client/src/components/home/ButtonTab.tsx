import type React from "react";

type PropsType = {
  title: string;
  tabMenu: string;
  setTabMenu: React.Dispatch<React.SetStateAction<string>>;
  active: string;
  text: string;
};
const ButtonTab = ({ tabMenu, setTabMenu, title, active, text }: PropsType) => {
  const handleClick = () => {
    setTabMenu(active);
  };
  return (
    <button
      onClick={handleClick}
      className={`!p-4 cursor-pointer text-neutral-800 text-sm ${active === tabMenu && "bg-white rounded-t-lg"}`}
    >
      {title} {text}
    </button>
  );
};

export default ButtonTab;
