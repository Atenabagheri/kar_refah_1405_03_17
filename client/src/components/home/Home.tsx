import { IranMap } from "react-iran-map";
import { electricityData } from "../../data/electricityData";
import { waterData } from "../../data/waterData";
import { gasData } from "../../data/gasData";
import { useEffect, useState } from "react";
import type { ProvinceType } from "../../types/types";
import ButtonMenu from "./ButtonMenu";
import { provinces } from "../../data/province";
import ChartEneregy from "./ChartEneregy";
import ListEnergy from "./ListEnergy";
import ButtonTab from "./ButtonTab";

export type MeterType = "electricity" | "water" | "gas";
export type DataType = {
  provinceName: string;
  provinceFaName: string;
  value: number | string | bigint;
};

type ElectricityData = Record<string, number>;

const Home = () => {
  const [selectedProvince, setSelectedProvince] = useState<
    ProvinceType | undefined
  >(undefined);
  const [meter, setMeter] = useState<MeterType>("electricity");
  const [color, setColor] = useState<string>("253, 199, 0");
  const [data, setData] = useState(electricityData);

  const [tabMenu, setTabMenu] = useState("list");
  const selectProvinceHandler = (province: ProvinceType): void => {
    setSelectedProvince(province);
    console.log(province.faName);
  };

  useEffect(() => {
    if (meter === "electricity") {
      setColor("253, 199, 0");
      setData(electricityData);
    } else if (meter === "water") {
      setColor("81, 162, 255");
      setData(waterData);
    } else if (meter === "gas") {
      setColor("255, 137, 4");
      setData(gasData);
    }
  }, [meter]);

  const text: string =
    meter === "electricity"
      ? "برق"
      : meter === "water"
        ? "آب"
        : meter === "gas"
          ? "گاز"
          : "برق";

  const bgColor: string =
    meter === "electricity"
      ? "#fef3c6 "
      : meter === "water"
        ? "#dbeafe "
        : meter === "gas"
          ? "#ffedd4"
          : "#fef3c6";

  const getMostData = (data: DataType | ElectricityData) => {
    const tenMost = Object.entries(data)
      .map(([provinceName, value]) => {
        const province = provinces.find((p) => p.provinceName === provinceName);
        return {
          provinceName,
          provinceFaName: province?.provinceFaName || provinceName,
          value,
        };
      })
      .sort((a, b) => Number(b?.value) - Number(a?.value))
      .slice(0, 10);

    return tenMost;
  };

  const getLeastData = (data: DataType | ElectricityData) => {
    const tenLeast = Object.entries(data)
      .map(([provinceName, value]) => {
        const province = provinces.find((p) => p.provinceName === provinceName);
        return {
          provinceName,
          provinceFaName: province?.provinceFaName || provinceName,
          value,
        };
      })
      .sort((a, b) => Number(a?.value) - Number(b?.value))
      .slice(0, 10);

    return tenLeast;
  };

  const dataMostEnergy: DataType[] | ElectricityData[] =
    meter === "electricity"
      ? getMostData(electricityData)
      : meter === "water"
        ? getMostData(waterData)
        : meter === "gas"
          ? getMostData(gasData)
          : getMostData(electricityData);

  const dataLeastEnergy: DataType[] | ElectricityData[] =
    meter === "electricity"
      ? getLeastData(electricityData)
      : meter === "water"
        ? getLeastData(waterData)
        : meter === "gas"
          ? getLeastData(gasData)
          : getLeastData(electricityData);

  return (
    <main className="flex items-center justify-center w-full h-full">
      <div className="flex gap-2 w-full h-full">
        <div
          style={{ backgroundColor: bgColor }}
          className="flex flex-col gap-4 basis-1/2 !p-4  overflow-y-auto"
        >
          <div className="flex items-center gap-2 justify-center">
            <ButtonMenu
              title="برق"
              className="bg-yellow-300/50 border-yellow-500 text-yellow-700"
              meter="electricity"
              setMeter={setMeter}
              image="/assets/images/building/tavanir.webp"
            />
            <ButtonMenu
              title="آب"
              className="bg-blue-300/50 border-blue-500 text-blue-700"
              meter="water"
              setMeter={setMeter}
              image="/assets/images/building/water.png"
            />
            <ButtonMenu
              title="گاز"
              className="bg-orange-300/50 border-orange-500 text-orange-700"
              meter="gas"
              setMeter={setMeter}
              image="/assets/images/building/gas-logo.png"
            />
          </div>
          <div className="flex flex-col gap-0 w-full">
            <div className="flex items-center gap-0">
              <ButtonTab
                active={"list"}
                title="لیست مصرف"
                tabMenu={tabMenu}
                setTabMenu={setTabMenu}
                text={text}
              />
              <ButtonTab
                active={"chart"}
                title="نمودار مصرف"
                tabMenu={tabMenu}
                setTabMenu={setTabMenu}
                text={text}
              />
            </div>
            {tabMenu === "list" && (
              <ListEnergy
                dataMostEnergy={dataMostEnergy}
                dataLeastEnergy={dataLeastEnergy}
                text={text}
              />
            )}
            {tabMenu === "chart" && (
              <ChartEneregy
                dataMostEnergy={dataMostEnergy}
                dataLeastEnergy={dataLeastEnergy}
                text={text}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 basis-1/2 !p-4">
          <div className="bg-neutral-100 rounded-lg border border-neutral-500 !p-2">
            <p className="text-center text-neutral-700">
              میزان مصرف ماهانه انرژی {text} استان ها
            </p>
          </div>
          <IranMap
            key={color}
            data={data}
            colorRange={color}
            width={567}
            textColor="#000"
            defaultSelectedProvince={selectedProvince?.name}
            deactiveProvinceColor="#eee"
            selectedProvinceColor="#a1a1a1"
            tooltipTitle="مصرف:"
            selectProvinceHandler={selectProvinceHandler}
          />
        </div>
      </div>
    </main>
  );
};

export default Home;
