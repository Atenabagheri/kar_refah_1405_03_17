import { PiCircleNotch } from "react-icons/pi";
import type { SubmitButtonType } from "../types/types";

const SubmitButton = ({
  isLoading,
  className,
  disabled = false,
  isEdit = false,
  type = "submit",
  onClick,
}: SubmitButtonType) => {
  return (
    <button
      onClick={onClick}
      className={`bg-primary w-full text-white text-sm rounded-md !p-1.5 cursor-pointer disabled:bg-secondary/80 disabled:cursor-auto relative ${className}`}
      type={type}
      disabled={disabled || isLoading}
    >
      <span>{isEdit ? "ویرایش" : "ثبت"}</span>
      {isLoading && (
        <div className="absolute top-1/2 -translate-y-1/2 left-5 animate-spin text-base">
          <PiCircleNotch />
        </div>
      )}
    </button>
  );
};

export default SubmitButton;
