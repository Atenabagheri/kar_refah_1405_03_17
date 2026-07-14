import React, { useEffect, useState } from "react";
import { IranPlateInput } from "./IranPlateInput";

const LicensePlate = ({
  setLicensePlate,
}: {
  setLicensePlate: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [plate, setPlate] = useState({
    part1: "",
    letter: "",
    part2: "",
    cityCode: "",
  });
  const { part1, letter, part2, cityCode } = plate;
  const plateQuery = part1 + letter + part2 + cityCode;

  useEffect(() => {
    if (
      !plate.letter ||
      plate.cityCode.length !== 2 ||
      plate.part1.length !== 2 ||
      plate.part2.length !== 3
    )
      return;

    setLicensePlate(plateQuery);
    console.log(plateQuery);
  }, [plateQuery, setLicensePlate, plate]);
  return (
    <div>
      <IranPlateInput value={plate} onChange={setPlate} />
    </div>
  );
};

export default LicensePlate;
