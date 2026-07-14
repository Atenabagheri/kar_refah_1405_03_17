import { useQuery } from "../hooks/useQuery";
import { provinces } from "../data/province";
import type React from "react";

const ProvinceSelector = () => {
  const { get, update } = useQuery();
  const p = get("p");
  const type = get("type");

  const provinceSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pr = e.target.value;
    update({ p: pr, page: "1" });
  };

  return (
    type === "province" && (
      <div className="flex items-center gap-1 text-sm">
        <span>استان: </span>
        <select
          defaultValue={p || ""}
          onChange={provinceSelectHandler}
          className="!p-2 rounded-lg w-40 bg-dark/5 shadow-md outline-none"
        >
          <option value="">همه استان‌ها</option>
          {provinces.map((prov) => (
            <option key={prov.provinceName} value={prov.provinceName}>
              {prov.provinceFaName}
            </option>
          ))}
        </select>
      </div>
    )
  );
};

export default ProvinceSelector;
