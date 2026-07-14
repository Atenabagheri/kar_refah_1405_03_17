import { useState } from "react";
import type { BuildingType } from "../../../../types/types";
import MetersList from "./MetersList";

interface PropsType {
  data: BuildingType | null;
}

const EnergyConsumption = ({ data }: PropsType) => {
  const [show, setShow] = useState<string | null>(null);
  return (
    data && (
      <>
        {show === "electricity" && (
          <MetersList
            data={data?.electricityMeters}
            setShow={setShow}
            meter="electricity"
          />
        )}
        {show === "water" && (
          <MetersList
            data={data?.waterMeters}
            setShow={setShow}
            meter="water"
          />
        )}
        {show === "gas" && (
          <MetersList data={data?.gasMeters} setShow={setShow} meter="gas" />
        )}
        <div className="border-t border-secondary/20 !space-y-4 !py-3">
          <h3 className="text-dark/90">مصارف انرژی</h3>
          <div className="grid grid-cols-3 gap-4">
            <div
              onClick={() => setShow("electricity")}
              className="bg-warning/60 cursor-pointer !p-2 rounded-md flex gap-3 items-center justify-center"
            >
              <img
                src="/assets/images/building/tavanir.webp"
                alt="اداره برق"
                className="w-8 h-8"
              />
              <span className="text-neutral-900">
                برق ({data?.electricityMeters.length})
              </span>
            </div>
            <div
              onClick={() => setShow("water")}
              className="bg-primary/60 cursor-pointer !p-2 rounded-md flex gap-3 items-center justify-center"
            >
              <img
                src="/assets/images/building/water.png"
                alt="اداره آب"
                className="w-10 h-10"
              />
              آب ({data?.waterMeters.length})
            </div>
            <div
              onClick={() => setShow("gas")}
              className="bg-danger/50 cursor-pointer !p-2 rounded-md flex gap-3 items-center justify-center"
            >
              <img
                src="/assets/images/building/gas-logo.png"
                alt="اداره گاز"
                className="w-8 h-8"
              />
              گاز ({data?.gasMeters.length})
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default EnergyConsumption;
