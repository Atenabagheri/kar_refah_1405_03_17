import { useState } from "react";
import type { PositionType, TotalPageType } from "../../../types/types";
import { PiCircleNotch } from "react-icons/pi";
import RowView from "../../../ui/RowView";
import Pagination from "../../../ui/Pagination";
import PositionListItem from "./PositionListItem";
import CounterList from "../../../ui/CounterList";
import { useQuery } from "../../../hooks/useQuery";

interface PropsType {
  dataList: DataList;
  loading: boolean;
}

interface DataList extends TotalPageType {
  data: PositionType[];
}

const PositionList = ({ dataList, loading }: PropsType) => {
  const [paramState, setParamState] = useState({
    title: "",
    code: "",
    description: "",
    maxEmployees: "",
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
              <th className="bg-primary/25 w-[20%] !p-1 relative rounded-tr-xl">
                <input
                  id="t1"
                  type="text"
                  name="code"
                  disabled
                  className={`${paramState?.code ? "outline-white/50 border" : ""} peer text-darkyellow-300 border-none outline-none focus:outline-white/50 cursor-pointer bg-primary-500 text-sm w-full font-normal rounded-md !p-1.5 !pr-8 border border-gray2`}
                  onChange={(e) => {
                    setParamState({
                      ...paramState,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <label
                  htmlFor="t1"
                  className={`${paramState?.code ? "left-full right-3" : ""} absolute cursor-pointer font-normal text-sm top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 peer-focus:left-full  whitespace-nowrap peer-focus:right-3`}
                >
                  کد
                </label>
              </th>
              <th className="bg-primary/25 w-[30%] !p-1 relative">
                <input
                  id="t2"
                  type="text"
                  name="title"
                  disabled
                  className={`${paramState?.title ? "outline-white/50 border" : ""} peer text-darkyellow-300 border-none outline-none focus:outline-white/50 cursor-pointer bg-primary-500 text-sm w-full font-normal rounded-md !p-1.5 !pr-16 border border-gray2`}
                  onChange={(e) => {
                    setParamState({
                      ...paramState,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <label
                  htmlFor="t2"
                  className={`${paramState?.title ? "left-full right-3" : ""} absolute cursor-pointer font-normal text-sm top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 peer-focus:left-full  whitespace-nowrap peer-focus:right-3`}
                >
                  عنوان
                </label>
              </th>
              <th className="bg-primary/25 w-[40%] !p-1 relative">
                <input
                  id="t3"
                  type="text"
                  name="description"
                  disabled
                  className={`${paramState?.description ? "outline-white/50 border" : ""} peer text-darkyellow-300 border-none outline-none focus:outline-white/50 cursor-pointer bg-primary-500 text-sm w-full font-normal rounded-md !p-1.5 !pr-16 border border-gray2`}
                  onChange={(e) => {
                    setParamState({
                      ...paramState,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <label
                  htmlFor="t3"
                  className={`${paramState?.description ? "left-full right-3" : ""} absolute cursor-pointer font-normal text-sm top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 peer-focus:left-full  whitespace-nowrap peer-focus:right-3`}
                >
                  توضیحات
                </label>
              </th>
              <th className="bg-primary/25 w-[10%] !p-1 relative rounded-tl-xl">
                <input
                  id="t4"
                  type="text"
                  name="maxEmployees"
                  disabled
                  className={`${paramState?.maxEmployees ? "outline-white/50 border" : ""} peer text-darkyellow-300 border-none outline-none focus:outline-white/50 cursor-pointer bg-primary-500 text-sm w-full font-normal rounded-md !p-1.5 !pr-16 focus:border focus:border-gray-400`}
                  onChange={(e) => {
                    setParamState({
                      ...paramState,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <label
                  htmlFor="t4"
                  className={`${paramState?.maxEmployees ? "left-full right-3" : ""} absolute cursor-pointer font-normal text-sm top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 peer-focus:left-full  whitespace-nowrap peer-focus:right-3`}
                >
                  ظرفیت
                </label>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4}>
                  <div className="h-[250px] w-full flex items-center justify-center bg-white">
                    <PiCircleNotch className="animate-spin text-4xl text-primary" />
                  </div>
                </td>
              </tr>
            ) : data?.length < 1 ? (
              <tr>
                <td colSpan={4}>
                  <div className="py-5 flex flex-col gap-3 items-center justify-center">
                    <div className="w-[220px] h-[220px] flex justify-center">
                      <img
                        src="/assets/images/not-found.svg"
                        alt="موردی یافت نشد..."
                      />
                    </div>
                    <h2 className="text-center text-sm"> موردی یافت نشد...</h2>
                  </div>
                </td>
              </tr>
            ) : (
              data?.map((position: PositionType) => (
                <PositionListItem position={position} key={position?.code} />
              ))
            )}
          </tbody>
        </table>
      </div>
      {data?.length > 0 && (
        <div className="flex justify-between items-center w-full">
          <RowView setLimit={setLimit} setCurrentPage={setCurrentPage} />

          <Pagination
            currentPage={Number(currentPage)}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
          <CounterList
            currentPage={+currentPage}
            limit={+limit}
            total={total}
            rows={data.length}
          />
        </div>
      )}
    </div>
  );
};

export default PositionList;
