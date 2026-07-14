import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import type { UnitPostType } from "../../types/types";
import api from "../../../api/axios";
import formatPeopleCount from "../../helper/formatPeopleCount";
import { PiCheckCircle } from "react-icons/pi";
import MyPieChart from "./MyPieChart";

const MainCityDetails = () => {
  const { province, dateCategory, name } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type: string | null = searchParams.get("type");
  const [data, setData] = useState<UnitPostType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
  }, [name]);

  useEffect(() => {
    if (!type) return;
    const getData = async () => {
      try {
        const url =
          type === "county"
            ? "/api/unit-position/get-unit-position-with-county-name/"
            : "/api/unit-position/get-unit-position-with-city-name/";
        const res = await api.get(url + `${dateCategory}/${name}`);
        // console.log(res?.data);;
        setData(res?.data);
      } catch (error) {
        console.log(error);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [type, dateCategory, name]);

  const pieData = [
    { name: "با تصدی", value: data && +data?.WithTenure },
    { name: "بدون تصدی", value: data && +data?.WithoutTenure },
  ];

  const handleBackToProvince = () => {
    navigate(`/human-resources/unit-position/map/${dateCategory}/${province}`);
  };

  return (
    <>
      <div
        onClick={handleBackToProvince}
        className="text-left cursor-pointer w-full border-b border-b-neutral-300 !p-2"
      >
        <span>لیست شهرستان‌ها</span>
      </div>
      {isLoading ? (
        <p className="text-center !pt-20 text-secondary font-bold">
          در حال بارگذاری...
        </p>
      ) : data === null ? (
        <p className="text-center !pt-20 text-secondary font-bold">
          موردی یافت نشد.
        </p>
      ) : (
        <>
          <div className="bg-blue-50 !p-2">
            <div
              onClick={handleBackToProvince}
              className="w-fit cursor-pointer flex items-center gap-2"
            >
              <span className="text-neutral-600">استان</span>
              <span>{data?.provinceName?.faName}</span>
            </div>
          </div>
          <div className=" flex items-center gap-0 bg-white">
            <div className="flex items-center gap-2 w-1/2 !p-2">
              <span className="text-neutral-600">شهرستان</span>
              <span>{data?.countyName?.faName}</span>
            </div>
            <div className="flex items-center gap-2 w-1/2 border-r border-r-neutral-200 !p-2">
              <span className="text-neutral-600">شهر</span>
              <span>{data?.cityName?.faName || "-"}</span>
            </div>
          </div>
          <div className="flex items-center gap-8  !p-2 w-full bg-blue-50">
            <span className="w-fit text-neutral-600">واحد اداری مصوب</span>
            <div className="flex items-center justify-center gap-6">
              <div
                className={`flex items-center gap-1 !p-1 ${data?.unitType === "Management" && "bg-green-200 rounded-md"}`}
              >
                {data?.unitType === "Management" && (
                  <PiCheckCircle className="text-2xl text-green-800" />
                )}
                <span>مدیریت/مرکز</span>
              </div>
              <div
                className={`flex items-center gap-1 !p-1 ${data?.unitType === "Department" && "bg-green-200 rounded-md"}`}
              >
                {data?.unitType === "Department" && (
                  <PiCheckCircle className="text-2xl text-green-800" />
                )}
                <span>اداره</span>
              </div>
              <div
                className={`flex items-center gap-1 !p-1 ${data?.unitType === "Agency" && "bg-green-200 rounded-md"}`}
              >
                {data?.unitType === "Agency" && (
                  <PiCheckCircle className="text-2xl text-green-800" />
                )}
                <span>نمایندگی</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 !pb-12 !p-2">
            <div className="flex items-start gap-10 ">
              <span className="text-neutral-600">تعداد پست ها</span>
              <div className="flex flex-col items-stretch justify-stretch gap-2 !pt-6">
                <div className="flex items-center justify-between gap-6 !px-2 bg-green-100 rounded-md !p-1">
                  <span>با تصدی</span>
                  <span>{data?.WithTenure}</span>
                </div>
                <div className="flex items-center justify-between gap-6 !px-2 bg-red-100 rounded-md !p-1">
                  <span>بلاتصدی</span>
                  <span>{data?.WithoutTenure}</span>
                </div>
                <div className="flex items-center justify-between gap-6 !px-2 bg-yellow-100 !p-1 rounded-md">
                  <span>جمع کل</span>
                  <span>
                    {data && +data?.WithTenure + +data?.WithoutTenure}
                  </span>
                </div>
              </div>
            </div>
            {/* نمودار */}
            <MyPieChart data={pieData} />
          </div>
          <div className="flex flex-col gap-2 bg-blue-50 !p-2 !pb-8">
            <span className="text-neutral-600">توضیحات</span>
            <p className="text-sm !pr-16">{data?.description}</p>
          </div>
          <div className="flex items-center gap-2 !pt-8 !p-2">
            <span className="text-neutral-600">جمعیت</span>
            {
              <div className="flex items-center gap-1">
                <span className="rounded-md !p-1">
                  {(data?.countyName && formatPeopleCount(+data?.population)) ||
                    (data?.population && formatPeopleCount(+data?.population))}
                </span>
                <span className="text-neutral-600">نفر</span>
              </div>
            }
          </div>
          <div className="flex items-center gap-2 !pذ-8 !p-2">
            {data?.officeComplex && (
              <span className="text-neutral-600">دارای احداث مجتمع اداری</span>
            )}
          </div>
          <div className="flex items-center gap-2 !p-2 !pb-8">
            <span className="text-neutral-600">
              فاصله تا نزدیکترین شهر/شهرستان دارای واحد اداری
            </span>
            <span>{data?.distance}</span>
            <span className="text-sm">کیلومتر</span>
          </div>
          <div className="flex flex-col gap-2 bg-blue-50 !p-2">
            <span className="text-neutral-600">توضیحات تکمیلی</span>
            <p className="text-sm !pr-16">{data?.updateDescription}</p>
          </div>
        </>
      )}
    </>
  );
};

export default MainCityDetails;
