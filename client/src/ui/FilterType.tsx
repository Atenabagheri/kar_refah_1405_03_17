import React, { useState } from "react";
import { useQuery } from "../hooks/useQuery";

const FilterType = () => {
  const { get, update } = useQuery();

  const t = get("type") ?? "";

  const [type, setType] = useState<string>(t);

  const typeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setType(value);

    update({
      type: value || null,
      p: null,
      page: "1",
    });
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span>نوع:</span>
      <select
        onChange={typeHandler}
        value={t ? type : ""}
        className="!p-2 rounded-lg w-40 bg-dark/5 shadow-md outline-none"
      >
        <option value={""}>همه</option>
        <option value="hqs">ستاد(وزارتخانه)</option>
        <option value="province">استان</option>
      </select>
    </div>
  );
};

export default FilterType;
