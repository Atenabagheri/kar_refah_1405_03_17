import type { AssetsType, TotalPageType } from "../../../types/types";
import { PiCircleNotch } from "react-icons/pi";
import RowView from "../../../ui/RowView";
import Pagination from "../../../ui/Pagination";
import AssetListItem from "./AssetListItem";
import { useQuery } from "../../../hooks/useQuery";
import { useState } from "react";
import CounterList from "../../../ui/CounterList";

interface PropsType {
  dataList: DataList;
  loading: boolean;
}

interface DataList extends TotalPageType {
  data: AssetsType[];
}

const AssetList = ({ dataList, loading }: PropsType) => {
  const { get } = useQuery();
  const page = get("page");
  const rows = get("rows");

  const [currentPage, setCurrentPage] = useState(page || 1);
  const [limit, setLimit] = useState(rows ? rows : 10);

  const data = dataList?.data;
  const total = dataList?.total;
  const totalPages = dataList?.totalPages;

  const [paramState, setParamState] = useState({
    serialNumber: "",
    name: "",
    description: "",
    category: "",
  });

  return (
    <div className="!space-y-4 !pb-5">
      <div className="w-full overflow-x-auto">
        <table className="min-w-[1200px] w-full table-fixed text-xs xl:text-sm rounded-tr-xl rounded-tl-xl bg-secondary/5">
          <thead>
            <tr className="rounded-tr-xl rounded-tl-xl">
              <th className="bg-primary/25 w-[15%] !p-1 relative rounded-tr-xl">
                <input
                  id="t1"
                  type="text"
                  name="serialNumber"
                  disabled
                  className={`${paramState?.serialNumber ? "outline-white/50 border" : ""} peer text-darkyellow-300 border-none outline-none focus:outline-white/50 cursor-pointer bg-primary-500 text-sm w-full font-normal rounded-md !p-1.5 !pr-8 border border-gray2`}
                  onChange={(e) => {
                    setParamState({
                      ...paramState,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <label
                  htmlFor="t1"
                  className={`${paramState?.serialNumber ? "left-full right-3" : ""} absolute cursor-pointer font-normal text-sm top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 peer-focus:left-full  whitespace-nowrap peer-focus:right-3`}
                >
                  شماره سریال
                </label>
              </th>
              <th className="bg-primary/25 w-[30%] !p-1 relative">
                <input
                  id="t2"
                  type="text"
                  name="name"
                  disabled
                  className={`${paramState?.name ? "outline-white/50 border" : ""} peer text-darkyellow-300 border-none outline-none focus:outline-white/50 cursor-pointer bg-primary-500 text-sm w-full font-normal rounded-md !p-1.5 !pr-16 border border-gray2`}
                  onChange={(e) => {
                    setParamState({
                      ...paramState,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <label
                  htmlFor="t2"
                  className={`${paramState?.name ? "left-full right-3" : ""} absolute cursor-pointer font-normal text-sm top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 peer-focus:left-full  whitespace-nowrap peer-focus:right-3`}
                >
                  عنوان
                </label>
              </th>
              <th className="bg-primary/25 w-[25%] !p-1 relative">
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
              <th className="bg-primary/25 w-[20%] !p-1 relative">
                <input
                  id="t4"
                  type="text"
                  name="category"
                  disabled
                  className={`${paramState?.category ? "outline-white/50 border" : ""} peer text-darkyellow-300 border-none outline-none focus:outline-white/50 cursor-pointer bg-primary-500 text-sm w-full font-normal rounded-md !p-1.5 !pr-16 focus:border focus:border-gray-400`}
                  onChange={(e) => {
                    setParamState({
                      ...paramState,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <label
                  htmlFor="t4"
                  className={`${paramState?.category ? "left-full right-3" : ""} absolute cursor-pointer font-normal text-sm top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 peer-focus:left-full  whitespace-nowrap peer-focus:right-3`}
                >
                  دسته‌بندی
                </label>
              </th>
              <th className="bg-primary/25 w-[10%] !p-1 rounded-tl-xl">
                <span className={`font-normal text-sm whitespace-nowrap`}>
                  مالکیت
                </span>
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
            ) : data?.length < 1 ? (
              <tr>
                <td colSpan={5}>
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
              data?.map((asset: AssetsType) => (
                <AssetListItem asset={asset} key={asset?.serialNumber} />
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

export default AssetList;
