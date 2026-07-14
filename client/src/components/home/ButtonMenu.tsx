import type React from "react";
import type { MeterType } from "./Home";

type PropsType = {
  title: string;
  className: string;
  image?: string;
  meter: MeterType;
  setMeter: React.Dispatch<React.SetStateAction<MeterType>>;
};
const ButtonMenu = ({
  title,
  className,
  image,
  meter,
  setMeter,
}: PropsType) => {
  const buttonHandler = () => {
    setMeter(meter);
  };
  return (
    <button
      className={`${className} border rounded-lg !p-2 min-w-[160px] flex items-center justify-center gap-2 cursor-pointer`}
      onClick={buttonHandler}
    >
      <span>{title}</span>
      {image && (
        <div className="flex items-center justify-center w-7 h-7">
          <img src={image} width={32} height={32} alt={title} className="" />
        </div>
      )}
    </button>
  );
};

export default ButtonMenu;
