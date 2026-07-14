import { useRef } from "react";
import type { InputFormType } from "../types/types";

const InputForm = ({
  name,
  title,
  onChange,
  type,
  min,
  check = false,
  placeholder,
  children,
  value,
  disabled = false,
  error,
}: InputFormType) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col gap-2 items-start w-full">
      <div className="flex items-center justify-between w-full">
        <label htmlFor={name} className="text-sm text-dark">
          {title} :
        </label>
        {check && !ref.current?.value && (
          <span className="text-xs text-danger">این فیلد الزامی است.</span>
        )}
        {ref.current?.value && error && (
          <span className="text-xs text-danger">{error}</span>
        )}
        {children}
      </div>
      <input
        className="border border-secondary/50 disabled:bg-secondary/10 disabled:cursor-not-allowed bg-white !p-1.5 rounded-md w-full text-sm placeholder:text-sm outline-none"
        type={type}
        name={name}
        min={min}
        onChange={onChange}
        placeholder={placeholder}
        ref={ref}
        value={value}
        disabled={disabled}
      />
    </div>
  );
};

export default InputForm;
