import React, { useState } from "react";
import { useQuery } from "../hooks/useQuery";
import type { BuildingType } from "../types/types";

type PropsType = {
  title?: string;
  bulidings: BuildingType[];
};
const FilterBuilding = ({ title, bulidings }: PropsType) => {
  const { get, update } = useQuery();

  const p = get("postalCode") ?? "";

  const [postalCode, setPostalCode] = useState<string>(p);

  const typeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setPostalCode(value);

    update({
      postalCode: value || null,
      p: null,
      page: "1",
    });
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span>{title}</span>
      <select
        onChange={typeHandler}
        value={p ? postalCode : ""}
        className="!p-2 rounded-lg w-40 bg-dark/5 shadow-md outline-none"
      >
        <option value={""}>همه</option>
        {bulidings?.map((building) => (
          <option key={building.postalCode} value={building.postalCode}>
            {building.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterBuilding;
