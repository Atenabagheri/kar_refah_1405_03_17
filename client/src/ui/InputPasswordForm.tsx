import { useState, type ReactNode } from "react";
import { PiEyeDuotone, PiEyeSlashDuotone } from "react-icons/pi";

interface PropsType {
  title: string;
  value: string;
  name: string;
  placeholder?: string;
  check: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  children?: ReactNode;
}

const InputPasswordForm = ({
  title,
  value,
  name,
  placeholder,
  onChange,
  check,
  children,
}: PropsType) => {
  const [type, setType] = useState<string>("password");
  return (
    <div className="flex flex-col gap-2 items-start">
      <div className="flex items-center justify-between w-full">
        <label htmlFor={name} className="text-sm text-dark">
          {title}
        </label>
        {check && !value ? (
          <span className="text-xs text-danger">این فیلد الزامی است.</span>
        ) : check && value && value?.length < 6 ? (
          <span className="text-xs text-danger">
            کلمه عبور باید حداقل 6 رقم باشد
          </span>
        ) : (
          children
        )}
      </div>
      <div className="relative w-full">
        <input
          className="border border-secondary/50 disabled:bg-secondary/10 disabled:cursor-not-allowed bg-white !p-1.5 rounded-md w-full text-sm placeholder:text-sm outline-none"
          type={type}
          name={name}
          onChange={onChange}
          onCopy={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
          value={value}
          placeholder={placeholder}
        />
        {value && (
          <button
            tabIndex={-1}
            type="button"
            onClick={() => setType(type === "password" ? "text" : "password")}
            className="absolute top-1/2 -translate-y-1/2 left-2 text-lg cursor-pointer"
          >
            {type === "password" ? <PiEyeDuotone /> : <PiEyeSlashDuotone />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputPasswordForm;
