import React, { useRef } from "react";

type IranPlateValue = {
  part1: string; // 2 digits
  letter: string; // Persian letter
  part2: string; // 3 digits
  cityCode: string; // 2 digits
};

type Props = {
  value: IranPlateValue;
  onChange: (value: IranPlateValue) => void;
};

const letters = [
  "الف",
  "ب",
  "پ",
  "ت",
  "ث",
  "ج",
  "چ",
  "ح",
  "خ",
  "د",
  "ذ",
  "ر",
  "ز",
  "س",
  "ش",
  "ص",
  "ض",
  "ط",
  "ع",
  "ف",
  "ق",
  "ک",
  "گ",
  "ل",
  "م",
  "ن",
  "و",
  "ه",
  "ی",
];

export const IranPlateInput: React.FC<Props> = ({ value, onChange }) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleDigitChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof IranPlateValue,
    index: number,
    maxLength: number,
  ) => {
    const val = e.target.value.replace(/\D/g, "");

    if (val.length <= maxLength) {
      onChange({
        ...value,
        [field]: val,
      });

      if (val.length === maxLength) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  return (
    <div
      className={`ltr flex items-center border-4 border-black rounded-xl w-fit shadow-lg overflow-hidden ${value.letter === "الف" ? "bg-danger text-light" : "bg-white"}`}
    >
      {/* Left side (numbers + letter) */}
      <div className="flex items-center gap-3 text-2xl font-bold">
        {/* 2 digit */}
        <input
          ref={(el) => {
            inputsRef.current[0] = el;
          }}
          type="text"
          value={value.part1}
          maxLength={2}
          onChange={(e) => handleDigitChange(e, "part1", 0, 2)}
          className="w-14 text-center border-b-2 border-gray-400 focus:outline-none focus:border-blue-500"
        />

        {/* letter dropdown */}
        <select
          value={value.letter}
          onChange={(e) => onChange({ ...value, letter: e.target.value })}
          className={`border-b-2 border-gray-400 bg-transparent focus:outline-none text-xl`}
        >
          <option
            value=""
            className={`${value.letter !== "الف" ? "" : "bg-danger"}`}
          >
            انتخاب
          </option>
          {letters.map((l) => (
            <option
              key={l}
              value={l}
              className={`${value.letter !== "الف" ? "" : "bg-danger"}`}
            >
              {l}
            </option>
          ))}
        </select>

        {/* 3 digit */}
        <input
          ref={(el) => {
            inputsRef.current[1] = el;
          }}
          type="text"
          value={value.part2}
          maxLength={3}
          onChange={(e) => handleDigitChange(e, "part2", 1, 3)}
          className="w-16 text-center border-b-2 border-gray-400 focus:outline-none focus:border-blue-500"
        />

        <div className="flex items-center gap-0">
          {/* 2 digit city */}
          <input
            ref={(el) => {
              inputsRef.current[2] = el;
            }}
            type="text"
            value={value.cityCode}
            maxLength={2}
            onChange={(e) => handleDigitChange(e, "cityCode", 2, 2)}
            className="w-14 text-center border-b-2 border-gray-400 focus:outline-none focus:border-blue-500"
          />

          {/* IR Blue section */}
          <div className="bg-blue-700 text-white !p-2 flex flex-col items-center text-sm font-semibold">
            <span>IR</span>
            <span className="text-xs">ایران</span>
          </div>
        </div>
      </div>
    </div>
  );
};
