import { useState } from "react";
import { useSearchParams } from "react-router";
import Pagination from "../../../ui/Pagination";
import type { BuildingType } from "../../../types/types";
import BuildingListItem from "./BuildingListItem";
import { PiCircleNotch } from "react-icons/pi";
import RowView from "../../../ui/RowView";

type DataType = {
  data: BuildingType[];
  total?: number;
  totalPages?: number;
  currentPage?: number;
};

type PropsType = {
  data: DataType | null;
  loading: boolean;
};

const BuildingList = ({ data, loading }: PropsType) => {
  const [paramState, setParamState] = useState({
    name: "",
    postalCode: "",
    province: "",
    county: "",
    city: "",
    address: "",
    type: "",
    usage: "",
    division: "",
  });
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");
  const rows = searchParams.get("rows");

  const [currentPage, setCurrentPage] = useState(page || 1);
  const [limit, setLimit] = useState(rows ? rows : 10);

  const lastIndex = +currentPage * +limit;
  const firstIndex = lastIndex - +limit;

  return (
    <div className="!space-y-4 !pb-5">
      <div className="w-full overflow-x-auto">
        <table className="min-w-[1200px] w-full table-fixed text-xs xl:text-sm rounded-tr-xl rounded-tl-xl bg-secondary/5">
          <thead>
            <tr className="rounded-tr-xl rounded-tl-xl">
              <th className="bg-primary/25 w-[5%] !p-1 relative rounded-tr-xl">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  ردیف
                </span>
              </th>
              <th className="bg-primary/25 w-[15%] !p-1 relative">
                <input
                  id="t1"
                  type="text"
                  name="name"
                  disabled
                  className={`${paramState?.name ? "outline-white/50 border" : ""} peer text-darkyellow-300 border-none outline-none focus:outline-white/50 cursor-pointer bg-primary-500 text-sm w-full font-normal rounded-md !p-1.5 !pr-8 border border-gray2`}
                  onChange={(e) => {
                    setParamState({
                      ...paramState,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <label
                  htmlFor="t1"
                  className={`${paramState?.name ? "left-full right-3" : ""} absolute cursor-pointer font-normal text-sm top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 peer-focus:left-full  whitespace-nowrap peer-focus:right-3`}
                >
                  نام ساختمان
                </label>
              </th>
              <th className="bg-primary/25 w-[10%] !p-1 relative">
                <input
                  id="t2"
                  type="text"
                  name="province"
                  disabled
                  className={`${paramState?.province ? "outline-white/50 border" : ""} peer text-darkyellow-300 border-none outline-none focus:outline-white/50 cursor-pointer bg-primary-500 text-sm w-full font-normal rounded-md !p-1.5 !pr-16 border border-gray2`}
                  onChange={(e) => {
                    setParamState({
                      ...paramState,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <label
                  htmlFor="t2"
                  className={`${paramState?.province ? "left-full right-3" : ""} absolute cursor-pointer font-normal text-sm top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 peer-focus:left-full  whitespace-nowrap peer-focus:right-3`}
                >
                  استان
                </label>
              </th>
              <th className="bg-primary/25 w-[10%] !p-1 relative">
                <input
                  id="t3"
                  type="text"
                  name="county"
                  disabled
                  className={`${paramState?.county ? "outline-white/50 border" : ""} peer text-darkyellow-300 border-none outline-none focus:outline-white/50 cursor-pointer bg-primary-500 text-sm w-full font-normal rounded-md !p-1.5 !pr-16 border border-gray2`}
                  onChange={(e) => {
                    setParamState({
                      ...paramState,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <label
                  htmlFor="t3"
                  className={`${paramState?.county ? "left-full right-3" : ""} absolute cursor-pointer font-normal text-sm top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 peer-focus:left-full  whitespace-nowrap peer-focus:right-3`}
                >
                  شهرستان
                </label>
              </th>
              <th className="bg-primary/25 w-[10%] !p-1 relative">
                <input
                  id="t4"
                  type="text"
                  name="city"
                  disabled
                  className={`${paramState?.city ? "outline-white/50 border" : ""} peer text-darkyellow-300 border-none outline-none focus:outline-white/50 cursor-pointer bg-primary-500 text-sm w-full font-normal rounded-md !p-1.5 !pr-16 border border-gray2`}
                  onChange={(e) => {
                    setParamState({
                      ...paramState,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <label
                  htmlFor="t4"
                  className={`${paramState?.city ? "left-full right-3" : ""} absolute cursor-pointer font-normal text-sm top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 peer-focus:left-full  whitespace-nowrap peer-focus:right-3`}
                >
                  شهر
                </label>
              </th>
              <th className="bg-primary/25 w-[10%] !p-1 relative">
                <input
                  id="t5"
                  type="text"
                  name="postalCode"
                  disabled
                  className={`${paramState?.postalCode ? "outline-white/50 border" : ""} peer text-darkyellow-300 border-none outline-none focus:outline-white/50 cursor-pointer bg-primary-500 text-sm w-full font-normal rounded-md !p-1.5 !pr-16 border border-gray2`}
                  onChange={(e) => {
                    setParamState({
                      ...paramState,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <label
                  htmlFor="t5"
                  className={`${paramState?.postalCode ? "left-full right-3" : ""} absolute cursor-pointer font-normal text-sm top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 peer-focus:left-full  whitespace-nowrap peer-focus:right-3`}
                >
                  کدپستی
                </label>
              </th>
              <th className="bg-primary/25 w-[10%] !p-1 relative">
                <input
                  id="t6"
                  type="text"
                  name="type"
                  disabled
                  className={`${paramState?.type ? "outline-white/50 border" : ""} peer text-darkyellow-300 border-none outline-none focus:outline-white/50 cursor-pointer bg-primary-500 text-sm w-full font-normal rounded-md !p-1.5 !pr-16 border border-gray2`}
                  onChange={(e) => {
                    setParamState({
                      ...paramState,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <label
                  htmlFor="t6"
                  className={`${paramState?.type ? "left-full right-3" : ""} absolute cursor-pointer font-normal text-sm top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 peer-focus:left-full  whitespace-nowrap peer-focus:right-3`}
                >
                  سایت
                </label>
              </th>
              <th className="bg-primary/25 w-[10%] !p-1 relative">
                <input
                  id="t6"
                  type="text"
                  name="type"
                  disabled
                  className={`${paramState?.type ? "outline-white/50 border" : ""} peer text-darkyellow-300 border-none outline-none focus:outline-white/50 cursor-pointer bg-primary-500 text-sm w-full font-normal rounded-md !p-1.5 !pr-16 border border-gray2`}
                  onChange={(e) => {
                    setParamState({
                      ...paramState,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <label
                  htmlFor="t6"
                  className={`${paramState?.type ? "left-full right-3" : ""} absolute cursor-pointer font-normal text-sm top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 peer-focus:left-full  whitespace-nowrap peer-focus:right-3`}
                >
                  نوع
                </label>
              </th>
              <th className="bg-primary/25 w-[10%] !p-1 relative">
                <input
                  id="t7"
                  type="text"
                  name="division"
                  disabled
                  className={`${paramState?.division ? "outline-white/50 border" : ""} peer text-darkyellow-300 border-none outline-none focus:outline-white/50 cursor-pointer bg-primary-500 text-sm w-full font-normal rounded-md !p-1.5 !pr-16 border border-gray2`}
                  onChange={(e) => {
                    setParamState({
                      ...paramState,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <label
                  htmlFor="t7"
                  className={`${paramState?.division ? "left-full right-3" : ""} absolute cursor-pointer font-normal text-sm top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 peer-focus:left-full  whitespace-nowrap peer-focus:right-3`}
                >
                  واحد سازمانی
                </label>
              </th>
              <th className="bg-primary/25 w-[15%] !p-1 relative rounded-tl-xl">
                <input
                  id="t8"
                  type="text"
                  name="usage"
                  disabled
                  className={`${paramState?.usage ? "outline-white/50 border" : ""} peer text-darkyellow-300 border-none outline-none focus:outline-white/50 cursor-pointer bg-primary-500 text-sm w-full font-normal rounded-md !p-1.5 !pr-16 border border-gray2`}
                  onChange={(e) => {
                    setParamState({
                      ...paramState,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <label
                  htmlFor="t8"
                  className={`${paramState?.usage ? "left-full right-3" : ""} absolute cursor-pointer font-normal text-sm top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 peer-focus:left-full  whitespace-nowrap peer-focus:right-3`}
                >
                  کاربری
                </label>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9}>
                  <div className="h-[250px] w-full flex items-center justify-center bg-white">
                    <PiCircleNotch className="animate-spin text-4xl text-primary" />
                  </div>
                </td>
              </tr>
            ) : !data?.data || data.data.length < 1 ? (
              <tr>
                <td colSpan={9}>
                  <div className="py-5 flex flex-col gap-3 items-center justify-center">
                    <div className="w-[220px] h-[220px] flex justify-center">
                      <img
                        src="/assets/images/not-found.svg"
                        alt="موردی یافت نشد..."
                      />
                    </div>
                    <h2 className="text-center text-sm">موردی یافت نشد...</h2>
                  </div>
                </td>
              </tr>
            ) : (
              data.data.map((building: BuildingType, index: number) => {
                const rowNumber =
                  (Number(currentPage) - 1) * Number(limit) + index + 1;
                return (
                  <BuildingListItem
                    building={building}
                    key={building?.postalCode || index}
                    row={rowNumber}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {Number(data?.data.length) > 0 && (
        <div className="flex flex-col gap-3 md:flex-row justify-between items-center max-w-full">
          <RowView setLimit={setLimit} setCurrentPage={setCurrentPage} />

          <Pagination
            currentPage={Number(currentPage)}
            totalPages={Number(data?.totalPages)}
            setCurrentPage={setCurrentPage}
          />
          <div className="text-sm flex items-center gap-4">
            <span>نمایش {firstIndex + 1}</span>
            <span>تا {lastIndex - (+limit - Number(data?.data.length))}</span>
            <span>از کل {Number(data?.total)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildingList;
