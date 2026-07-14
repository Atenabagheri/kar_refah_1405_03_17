// import { useRef } from "react";
import type { StatitcSelectFormType } from "../types/types";

const StaticSelectForm = ({
  title,
  name,
  onChange,
  options,
  children,
  check = false,
  value,
  disabled = false,
}: StatitcSelectFormType) => {
  // const ref = useRef<HTMLSelectElement>(null);
  return (
    <div className="flex flex-col gap-2 items-start w-full">
      <div className="flex items-center justify-between w-full">
        <label htmlFor={name} className="text-sm text-dark">
          {title} :
        </label>
        {check && !value && (
          <span className="text-xs text-danger">این فیلد الزامی است.</span>
        )}
        {children}
      </div>
      <select
        value={value}
        disabled={disabled}
        onChange={onChange}
        className="rounded-md disabled:bg-secondary/10 disabled:cursor-not-allowed bg-white !p-1.5 cursor-pointer text-sm w-full basis-[75%] border outline-none border-secondary/50"
      >
        <option value={""}>انتخاب کنید</option>
        {options?.map((option, index: number) => (
          <option key={index} value={option?.value}>
            {option?.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StaticSelectForm;
