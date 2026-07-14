import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchUnitPostsByProvince } from "../../redux/slices/subtopics/unitPost/unitPostSlice";
import { useLocation, useNavigate, useParams } from "react-router";
import LoadingProvincesList from "./LoadingProvincesList";
import type { UnitPostType } from "../../types/types";

const MainProvinceDetails = () => {
  const dispatch = useAppDispatch();
  const { unitPostByProvinceList, loading } = useAppSelector(
    (state) => state.unitPost
  );
  const navigate = useNavigate();
  const { province, dateCategory } = useParams();
  const location = useLocation();
  const provinceFaName = location.state;
  useEffect(() => {
    dispatch(fetchUnitPostsByProvince({ dateCategory, province }));
  }, [dispatch, province, dateCategory]);

  const selectCountyHandler = (countyName: string | undefined): void => {
    if (countyName) {
      navigate(`${countyName}?type=county`);
    }
  };
  const selectCityHandler = (cityName: string | undefined): void => {
    if (cityName) {
      navigate(`${cityName}?type=city`);
    }
  };
  const data: UnitPostType[] = unitPostByProvinceList
    ? unitPostByProvinceList?.data?.filter((d) => !d?.countyName?.isNewCounty)
    : [];
  const newCounties = unitPostByProvinceList
    ? unitPostByProvinceList?.data?.filter((d) => d?.countyName?.isNewCounty)
    : [];
  const headquarter = unitPostByProvinceList?.headquarter;
  
  return (
    <>
      <div className="flex items-center gap-0 w-full border-b border-b-neutral-300 !p-2">
        {loading === "loadingUnitByProvince" ? (
          <div className="h-11 w-[120px] bg-neutral-300 rounded-lg animate-pulse"></div>
        ) : (
          <span className={`!p-2 text-blue-900 text-xl text-shadow-sm`}>
            استان{" "}
            {provinceFaName ||
              unitPostByProvinceList?.data[0]?.provinceName?.faName}
          </span>
        )}
      </div>
      <div className="max-h-[80vh] overflow-y-auto">
        <div className="grid grid-cols-12 gap-0 text-sm border-b border-b-neutral-400 text-center bg-blue-900 text-white">
          <span className="border-l border-l-neutral-400 content-center !p-1">
            ردیف
          </span>
          <span className="border-l border-l-neutral-400 content-center !p-1">
            شهرستان
          </span>
          <span className="border-l border-l-neutral-400 content-center !p-1">
            شهر
          </span>
          <div className="col-span-3 grid grid-rows-2 border-l border-l-neutral-400">
            <span className="border-b border-b-neutral-400 content-center !p-1">
              واحد اداری مصوب
            </span>
            <div className="grid grid-cols-3 text-xs">
              <span className="border-l border-l-neutral-400 content-center !p-1">
                مدیریت/مرکز
              </span>
              <span className="border-l border-l-neutral-400 content-center !p-1">
                اداره
              </span>
              <span className="content-center">نمایندگی</span>
            </div>
          </div>
          <div className="grid grid-rows-2 col-span-2 border-l border-l-neutral-400">
            <span className="content-center border-b border-b-neutral-400 !p-1">
              تعداد پست ها
            </span>
            <div className="grid grid-cols-2 text-xs">
              <span className="border-l border-l-neutral-400 content-center !p-1">
                باتصدی
              </span>
              <span className="content-center">بلاتصدی</span>
            </div>
          </div>
          <span className="border-l border-l-neutral-400 content-center !p-1">
            جمع کل
          </span>
          <span className="border-l border-l-neutral-400 content-center text-xs !p-1">
            احداث
          </span>
          <span className="col-span-2 content-center !p-1">توضیحات</span>
        </div>
        {loading === "loadingUnitByProvince" ? (
          <LoadingProvincesList />
        ) : (
          <>
            {/* شهر ها و شهرستان ها */}
            {data?.length > 0 &&
              data
                //   ?.sort((a, b) => (b?._id.localeCompare(a?._id)))
                ?.map((unit: UnitPostType) => (
                  <div
                    key={unit?._id}
                    className="grid grid-cols-12 gap-0 text-sm text-center odd:bg-blue-50"
                  >
                    <span className="!p-1 content-center ">
                      {data?.indexOf(unit) + 1}
                    </span>
                    <span
                      onClick={() =>
                        !unit.cityName &&
                        selectCountyHandler(unit.countyName?.name)
                      }
                      className={`!p-1 content-center  ${unit.countyName && "hover:bg-amber-100 cursor-pointer"}`}
                    >
                      {unit?.countyName?.faName}
                    </span>
                    <span
                      onClick={() =>
                        unit.cityName && selectCityHandler(unit.cityName?.name)
                      }
                      className={`!p-1 content-center  ${unit.cityName && "hover:bg-amber-100 cursor-pointer"}`}
                    >
                      {unit?.cityName?.faName}
                    </span>
                    <div className="col-span-3 grid grid-cols-3 ">
                      <span className="!p-1 content-center">
                        {unit.unitType === "Management" && "*"}
                      </span>
                      <span className="!p-1 content-center">
                        {unit.unitType === "Department" && "*"}
                      </span>
                      <span className="!p-1 content-center">
                        {unit.unitType === "Agency" && "*"}
                      </span>
                    </div>
                    <div className="col-span-2 grid grid-cols-2 ">
                      <span className="!p-1 content-center ">
                        {unit.WithTenure}
                      </span>
                      <span className="!p-1 content-center">
                        {unit.WithoutTenure}
                      </span>
                    </div>
                    <span className="!p-1 content-center ">
                      {+unit?.WithTenure + +unit?.WithoutTenure}
                    </span>
                    <span className="!p-1 content-center ">
                      {unit?.officeComplex && "*"}
                    </span>
                    <span className="!p-1 content-center col-span-2 text-[10px]">
                      {unit?.description}
                    </span>
                  </div>
                ))}

            {/* ستاد اداره کل استان  */}

            {unitPostByProvinceList &&
              unitPostByProvinceList?.data.length > 0 && (
                <div className="grid grid-cols-12 gap-0 text-sm text-center !p-1.5 !mt-3 bg-orange-50">
                  <div className="col-span-3 flex items-center justify-center">
                    <span className="w-full text-center text-xs">
                      ستاد اداره کل استان{" "}
                    </span>
                  </div>
                  <div className="col-span-3 grid grid-cols-3 "></div>
                  <div className="col-span-2 grid grid-cols-2 ">
                    <span className="!p-1 content-center ">
                      {headquarter?.WithTenure}
                    </span>
                    <span className="!p-1 content-center">
                      {headquarter?.WithoutTenure}
                    </span>
                  </div>
                  <span className="!p-1 content-center ">
                    {headquarter?.total}
                  </span>
                  <span className="!p-1 content-center "></span>
                  <span className="!p-1 content-center col-span-2 text-[10px]"></span>
                </div>
              )}
            {/* جمع کل */}

            {unitPostByProvinceList &&
              unitPostByProvinceList?.data.length > 0 && (
                <div className="grid grid-cols-12 gap-0 text-sm text-center bg-orange-100 !mt-6">
                  <div className="col-span-3 flex items-center justify-center">
                    <span className="w-full text-center text-xs">جمع کل</span>
                  </div>
                  <div className="col-span-3 grid grid-cols-3 ">
                    <span className="!p-1 content-center ">
                      {unitPostByProvinceList?.totalManagement}
                    </span>
                    <span className="!p-1 content-center ">
                      {unitPostByProvinceList?.totalDepartment}
                    </span>
                    <span className="!p-1 content-center">
                      {unitPostByProvinceList?.totalAgency}
                    </span>
                  </div>
                  <div className="col-span-2 grid grid-cols-2 ">
                    <span className="!p-1 content-center ">
                      {unitPostByProvinceList?.totalWithTenure}
                    </span>
                    <span className="!p-1 content-center">
                      {unitPostByProvinceList?.totalWithoutTenure}
                    </span>
                  </div>
                  <span className="!p-1 content-center ">
                    {unitPostByProvinceList &&
                      +unitPostByProvinceList?.totalWithTenure +
                        +unitPostByProvinceList?.totalWithoutTenure}
                  </span>
                  <span className="!p-1 content-center "></span>
                  <span className="!p-1 content-center col-span-2 text-[10px]"></span>
                </div>
              )}

            {/* شهر های جدید */}
            <div className=" !mt-12">
              {newCounties &&
                newCounties.map((unit: UnitPostType) => (
                  <div
                    key={unit?._id}
                    className="grid grid-cols-12 gap-0 text-sm text-center odd:bg-amber-100 even:bg-amber-50"
                  >
                    <span className="!p-1 content-center ">
                      {newCounties.indexOf(unit) + 1}
                    </span>
                    <span className="!p-1 content-center">
                      {unit?.countyName?.faName}
                    </span>
                    <span
                      //   onClick={() =>
                      //     unit.unitRelated &&
                      //     selectunitHandler(unit.unitRelated?.name)
                      //   }
                      className="!p-1"
                    >
                      {/* {unit?.countyName?.faName} */}
                    </span>
                    <div className="col-span-6 content-center ">
                      <span className="text-xs">فاقد واحد اداری</span>
                    </div>
                    <span className="!p-1 content-center ">
                      {unit?.officeComplex && "*"}
                    </span>
                    <span className="!p-1 content-center col-span-2 text-[10px]">
                      {unit?.description}
                    </span>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MainProvinceDetails;
