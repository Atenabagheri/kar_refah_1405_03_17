import { useState } from "react";
import VehicleList from "./VehicleList";
import FilterType from "../../../ui/FilterType";
import { useQuery } from "../../../hooks/useQuery";
import MainUploadExcel from "../../upload-excel/MainUploadExcel";
import { useAppSelector } from "../../../redux/hooks";
import { useFetch } from "../../../hooks/useFetch";
import type { TotalPageType, VehicleType } from "../../../types/types";
import CancelReqButton from "../../../ui/CancelReqButton";
import ProvinceSelector from "../../../ui/ProvinceSelector";
import TemplateDownload from "../../../ui/TemplateDownload";
import { provinces } from "../../../data/province";
import Search from "../../../ui/Search";
// import { IranPlateInput } from "../../../ui/IranPlateInput";
// import MainUploadFile from "../../../ui/MainUploadFile";

interface DataList extends TotalPageType {
  data: VehicleType[];
}
const MainListVehicle = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { deleteId } = useAppSelector((state) => state.ui);

  // const [plate, setPlate] = useState({
  //   part1: "",
  //   letter: "",
  //   part2: "",
  //   cityCode: "",
  // });
  // const { part1, letter, part2, cityCode } = plate;
  // const plateQuery = part1 + letter + part2 + cityCode;

  const MPO = user?.roles === "MPO";
  const { get } = useQuery();
  const p = get("p") ?? "";
  const t = get("type") ?? "";
  const s = get("search") ?? "";

  const page = get("page");
  const rows = get("rows");

  const [paramState, setParamState] = useState({
    model: "",
    brand: "",
    licensePlate: "",
    vin: "",
    color: "",
  });

  const {
    data: dataList,
    loading,
    setLoading,
    controllerRef,
  } = useFetch<DataList>({
    url: `/api/vehicle/get-vehicles-with-type?page=${page}&limit=${rows}${t ? `&type=${t}` : ""}${p ? `&province=${p}` : ""}${s ? `&search=${s}` : ""}`,
    dependencies: [page, rows, t, p, s, deleteId],
    initialData: { data: [], total: 0, totalPages: 0, currentPage: 1 },
  });

  const province = provinces.find(
    (pr) => pr.provinceName === p,
  )?.provinceFaName;

  const textList = MPO
    ? "لیست خودروهای استان " + user.province.faName
    : !t
      ? "لیست خودروهای ستاد و استان"
      : t === "hqs"
        ? "لیست خودروهای ستاد"
        : t === "province" && p
          ? "لیست خودروهای استان " + province
          : "لیست خودروهای تمام استان ها";

  // const searchHandler = () => {
  //   if (plateQuery) {
  //     const searchParam = `&search=${plateQuery}`;
  //     console.log(searchParam);
  //     update({ search: plateQuery });
  //   }
  // };
  return (
    <div className="!py-4 !px-3 xl:!px-8 !space-y-4">
      <CancelReqButton
        loading={loading}
        setLoading={setLoading}
        controllerRef={controllerRef}
      />

      <div className="flex items-center justify-between gap-2 w-full border-b border-b-dark/10 !pb-4">
        <Search placeholder="جستجو پلاک، مدل یا شماره شاسی..." />
        {user?.roles === "MHQO" && (
          <div className="flex items-center gap-2">
            <ProvinceSelector />
            <FilterType />
          </div>
        )}
      </div>

      {/* <div className="flex items-center gap-4">
        <IranPlateInput value={plate} onChange={setPlate} />
        <button onClick={searchHandler} className="text-sm cursor-pointer">جستجو</button>
      </div> */}
      <p className="font-medium text-dark/90">{textList}</p>

      <VehicleList
        dataList={dataList}
        loading={loading}
        paramState={paramState}
        setParamState={setParamState}
      />
      {user?.isAdmin && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <MainUploadExcel
              url="/api/vehicle/upload"
              fileName="vehicle"
              title="بارگزاری لیست خودروها"
            />
            <MainUploadExcel
              url="/api/vehicle-type/upload"
              fileName="vehicleType"
              title="بارگزاری نوع خودرو"
            />
            <MainUploadExcel
              url="/api/vehicle-brand/upload"
              fileName="vehicleBrand"
              title="بارگزاری برند خودرو"
            />
            <MainUploadExcel
              url="/api/insurance/upload"
              fileName="insurance"
              title="بارگزاری سوابق بیمه"
            />
            {/* <MainUploadFile
              url="/api/vehicle-type/upload-file"
              title="بارگزاری فایل"
            /> */}
          </div>
          <div className="flex items-center gap-1">
            <TemplateDownload title="خودروها" fileName="vehicle.xlsx" />
            <TemplateDownload title="نوع خودرو" fileName="vehicleType.xlsx" />
            <TemplateDownload title="مدل خودرو" fileName="vehicleModel.xlsx" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainListVehicle;
