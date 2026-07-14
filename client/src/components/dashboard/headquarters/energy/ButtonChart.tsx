import React from "react";

type ShowType = "electricity" | "water" | "gas";

type PropsType = {
  title: string;
  className: string;
  showChart: ShowType;
  setShowChart: React.Dispatch<React.SetStateAction<ShowType>>;
};
const ButtonChart = ({
  title,
  className,
  showChart,
  setShowChart,
}: PropsType) => {
  return (
    <button
      onClick={() => setShowChart(showChart)}
      className={`${className} !p-1 text-sm cursor-pointer text-neutral-900 border-neutral-500 w-full border`}
    >
      {title}
    </button>
  );
};

export default ButtonChart;
