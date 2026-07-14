import { useRef } from "react";
import type { TextareaFormType } from "../types/types";

const TextAreaForm = ({
  name,
  title,
  onChange,
  check = false,
  placeholder,
  children,
  value,
  className
}: TextareaFormType) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="flex flex-col gap-2 items-start">
      <div className="flex items-center justify-between w-full">
        <label htmlFor={name} className="text-sm text-dark">
          {title} :
        </label>
        {check && !ref.current?.value && (
          <span className="text-xs text-danger">این فیلد الزامی است.</span>
        )}
        {children}
      </div>
      <textarea
        className={`border border-secondary/50 bg-white !p-1.5 rounded-md w-full text-sm resize-none placeholder:text-sm outline-none ${className}`}
        name={name}
        rows={4}
        onChange={onChange}
        placeholder={placeholder}
        ref={ref}
        value={value}
      />
    </div>
  );
};

export default TextAreaForm;
