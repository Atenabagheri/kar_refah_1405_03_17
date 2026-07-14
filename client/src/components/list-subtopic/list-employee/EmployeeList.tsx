import { useState } from "react";
import EmployeeListItem from "./EmployeeListItem";
import type { EmployeeType, TotalPageType } from "../../../types/types";
import { PiCircleNotch } from "react-icons/pi";
import Pagination from "../../../ui/Pagination";
import RowView from "../../../ui/RowView";
import { useQuery } from "../../../hooks/useQuery";
import CounterList from "../../../ui/CounterList";

interface DataList extends TotalPageType {
  data: EmployeeType[];
}

interface PropsType {
  dataList: DataList;
  loading: boolean;
}
const EmployeeList = ({ dataList, loading }: PropsType) => {
  const [paramState, setParamState] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    phone: "",
    positionCode: "",
  });

  const { get } = useQuery();
  const page = get("page");
  const rows = get("rows");

  const [currentPage, setCurrentPage] = useState(page || 1);
  const [limit, setLimit] = useState(rows ? rows : 10);

  const data = dataList?.data;
  const total = dataList?.total;
  const totalPages = dataList?.totalPages;

  return (
    <div className="!space-y-4 !pb-5">
      <div className="w-full overflow-x-auto">
        <table className="min-w-[1200px] w-full table-fixed text-xs xl:text-sm rounded-tr-xl rounded-tl-xl bg-secondary/5">
          <thead>
            <tr className="rounded-tr-xl rounded-tl-xl">
              <th className="bg-primary/25 w-[5%] !p-1 relative rounded-tr-xl">
                <input
                  type="text"
                  disabled
                  className={`peer text-darkyellow-300 border-none outline-none focus:outline-white/50 cursor-pointer bg-primary-500 text-sm w-full font-normal rounded-md !p-1.5 !pr-8 border border-gray2`}
                />
                <label
                  className={`absolute cursor-pointer font-normal text-sm top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 peer-focus:left-full text-surface whitespace-nowrap peer-focus:right-3`}
                >
                  ردیف
                </label>
              </th>

              <th className="bg-primary/25 w-[15%] !p-1 relative">
                <input
                  id="t1"
                  type="text"
                  name="firstName"
                  disabled
                  className={`${paramState?.firstName ? "outline-surface/50 border" : ""} peer text-darkyellow-300 border-none outline-none focus:outline-white/50 cursor-pointer bg-primary-500 text-sm w-full font-normal rounded-md !p-1.5 !pr-8 border border-gray2`}
                  onChange={(e) => {
                    setParamState({
                      ...paramState,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <label
                  htmlFor="t1"
                  className={`${paramState?.firstName ? "left-full right-3" : ""} absolute cursor-pointer font-normal text-sm top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 peer-focus:left-full text-surface whitespace-nowrap peer-focus:right-3`}
                >
                  نام
                </label>
              </th>
              <th className="bg-primary/25 w-[15%] !p-1 relative">
                <input
                  id="t2"
                  type="text"
                  name="lastName"
                  disabled
                  className={`${paramState?.lastName ? "outline-surface/50 border" : ""} peer text-darkyellow-300 border-none outline-none focus:outline-surface/50 cursor-pointer bg-primary-500 text-sm w-full font-normal rounded-md !p-1.5 !pr-16 border border-gray2`}
                  onChange={(e) => {
                    setParamState({
                      ...paramState,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <label
                  htmlFor="t2"
                  className={`${paramState?.lastName ? "left-full right-3" : ""} absolute cursor-pointer font-normal text-sm top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 peer-focus:left-full text-surface whitespace-nowrap peer-focus:right-3`}
                >
                  نام خانوادگی
                </label>
              </th>
              <th className="bg-primary/25 w-[15%] !p-1 relative">
                <input
                  id="t3"
                  type="text"
                  name="nationalId"
                  disabled
                  className={`${paramState?.nationalId ? "outline-surface/50 border" : ""} peer text-darkyellow-300 border-none outline-none focus:outline-surface/50 cursor-pointer bg-primary-500 text-sm w-full font-normal rounded-md !p-1.5 !pr-16 border border-gray2`}
                  onChange={(e) => {
                    setParamState({
                      ...paramState,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <label
                  htmlFor="t3"
                  className={`${paramState?.nationalId ? "left-full right-3" : ""} absolute cursor-pointer font-normal text-sm top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 peer-focus:left-full text-surface whitespace-nowrap peer-focus:right-3`}
                >
                  کد ملی
                </label>
              </th>
              <th className="bg-primary/25 w-[15%] !p-1 relative">
                <input
                  id="t4"
                  type="text"
                  name="phone"
                  disabled
                  className={`${paramState?.phone ? "outline-surface/50 border" : ""} peer text-darkyellow-300 border-none outline-none focus:outline-surface/50 cursor-pointer bg-primary-500 text-sm w-full font-normal rounded-md !p-1.5 !pr-16 border border-gray2`}
                  onChange={(e) => {
                    setParamState({
                      ...paramState,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <label
                  htmlFor="t4"
                  className={`${paramState?.phone ? "left-full right-3" : ""} absolute cursor-pointer font-normal text-sm top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 peer-focus:left-full text-surface whitespace-nowrap peer-focus:right-3`}
                >
                  شماره تلفن
                </label>
              </th>
              <th className="bg-primary/25 w-[25%] !p-1 relative rounded-tl-xl">
                <input
                  id="t5"
                  type="text"
                  name="positionCode"
                  disabled
                  className={`${paramState?.positionCode ? "outline-surface/50 border" : ""} peer text-darkyellow-300 border-none outline-none focus:outline-surface/50 cursor-pointer bg-primary-500 text-sm w-full font-normal rounded-md !p-1.5 !pr-16 border border-gray2`}
                  onChange={(e) => {
                    setParamState({
                      ...paramState,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <label
                  htmlFor="t5"
                  className={`${paramState?.positionCode ? "left-full right-3" : ""} absolute cursor-pointer font-normal text-sm top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 peer-focus:left-full text-surface whitespace-nowrap peer-focus:right-3`}
                >
                  سمت
                </label>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>
                  <div className="h-[250px] w-full flex items-center justify-center bg-white">
                    <PiCircleNotch className="animate-spin text-4xl text-primary" />
                  </div>
                </td>
              </tr>
            ) : total === 0 ? (
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
              data.map((employee: EmployeeType, index: number) => {
                const rowNumber =
                  (Number(currentPage) - 1) * Number(limit) + index + 1;
                return (
                  <EmployeeListItem
                    employee={employee}
                    key={employee?.nationalId}
                    row={rowNumber}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {total > 0 && (
        <div className="flex justify-between items-center w-full">
          <RowView setLimit={setLimit} setCurrentPage={setCurrentPage} />

          <Pagination
            currentPage={+currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
          <CounterList
            currentPage={+currentPage}
            limit={+limit}
            rows={data.length}
            total={total}
          />
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
