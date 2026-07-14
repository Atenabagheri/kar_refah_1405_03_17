import { IranProvincesMap } from "react-iran-provinces-map";
import { useNavigate, useParams } from "react-router";
import { provinceData } from "../../data/provinceData";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchCityWithCounty } from "../../redux/slices/subtopics/city/citySlice";
import { useEffect, useRef, useState } from "react";
import { fetchAllCountiesWithCity } from "../../redux/slices/subtopics/county/countySlice";
import type { ProvinceType } from "../../types/types";

const MainCountyMap = () => {
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { cityByCounty, loading } = useAppSelector((state) => state.city);
  const county = useAppSelector((state) => state.county);
  const {
    province,
    // name
  } = useParams();
  const myProvince: string = province ? province : "";
  const navigate = useNavigate();
  const [countySelected, setCountySelected] = useState<string>("");

  useEffect(() => {
    dispatch(fetchAllCountiesWithCity());
  }, [dispatch]);

  const selectProvinceHandler = (mycounty: ProvinceType): void => {
    if (!mycounty.name) return;
    if (
      county?.allCountiesWithCity.find((city) => city?.name === mycounty.name)
    ) {
      // navigate(`${county?.name}?type=city`);
      setCountySelected(mycounty.name);
      console.log(mycounty);
      dispatch(fetchCityWithCounty(mycounty.name));
    } else {
      setCountySelected("");
      navigate(`${mycounty?.name}?type=county`);
    }
  };

  const citySelected = (city: string) => {
    navigate(`${city}?type=city`);
    setCountySelected("");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setCountySelected("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setCountySelected]);

  return county?.loading === "loading" ? (
    <div className="h-full flex items-center justify-center">
      در حال بارگذاری...
    </div>
  ) : (
    <div
      ref={ref}
      className="relative">
      {countySelected && loading === "loadingByCounty" ? (
        <div className="absolute top-1/2 left-1/2 -translate-1/2 z-10 bg-white/50 rounded-md backdrop-blur-sm shadow-md min-w-[180] !p-4">
          <span className="text-xs text-center">در حال بارگذاری...</span>
        </div>
      ) : (
        countySelected &&
        cityByCounty?.length > 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-1/2 z-10 bg-white/50 rounded-md backdrop-blur-sm shadow-md min-w-[180]">
            <div className="flex flex-col gap-0 w-full items-center">
              {cityByCounty?.map((c, i) => (
                <span
                  key={i}
                  onClick={() => citySelected(c.name)}
                  className="!p-4 text-sm cursor-pointer border-b border-b-neutral-200"
                >
                  {c.faName}
                </span>
              ))}
            </div>
          </div>
        )
      )}
      <IranProvincesMap
        province={myProvince}
        provinceData={provinceData[myProvince]}
        colorRange="30, 70, 181"
        deactiveProvinceColor="#eee"
        selectedProvinceColor="#3bcc6d"
        tooltipTitle="تعداد:"
        textColor="#000"
        width={600}
        selectProvinceHandler={selectProvinceHandler}
      />
    </div>
  );
};

export default MainCountyMap;
