type ActiveType = "Technical" | "Insurance" | "Repair";

type PropsType = {
  title: string;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<ActiveType>>;
  active: ActiveType;
};
const ButtonTab = ({ title, setActiveTab, activeTab, active }: PropsType) => {
  const clickHandler = () => {
    setActiveTab(active);
  };
  return (
    <button
      onClick={clickHandler}
      className={`cursor-pointer !p-3 w-full text-sm text-neutral-900 ${active === activeTab ? "bg-sky-200" : "bg-neutral-100"}`}
    >
      {title}
    </button>
  );
};

export default ButtonTab;
