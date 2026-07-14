import { PiCircleNotch } from "react-icons/pi";
import type { TotalPageType, VehicleType } from "../../../types/types";
import Pagination from "../../../ui/Pagination";
import RowView from "../../../ui/RowView";
import VehicleListItem from "./VehicleListItem";
import { useState } from "react";
import { useQuery } from "../../../hooks/useQuery";
import CounterList from "../../../ui/CounterList";

interface PropsType {
  dataList: DataList;
  loading: boolean;
  setParamState: React.Dispatch<
    React.SetStateAction<{
      model: string;
      brand: string;
      licensePlate: string;
      vin: string;
      color: string;
    }>
  >;
  paramState: {
    model: string;
    brand: string;
    licensePlate: string;
    vin: string;
    color: string;
  };

  //   search: string;
  //   setSearch: React.Dispatch<React.SetStateAction<string>>;

  //   selectCategory: FilterDataType | null;
  //   setSelectCategory: React.Dispatch<
  //     React.SetStateAction<FilterDataType | null>
  //   >;
}

interface DataList extends TotalPageType {
  data: VehicleType[];
}
const VehicleList = ({ dataList, loading }: PropsType) => {
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
              {/* ردیف 5 */}
              <th className="bg-primary/25 w-[5%] !p-1 rounded-tr-xl">
                <span className={`font-normal text-sm whitespace-nowrap`}>
                  ردیف
                </span>
              </th>
              {/* نوع خودرو 10 */}
              <th className="bg-primary/25 w-[10%] !p-1">
                <span className={`font-normal text-sm whitespace-nowrap`}>
                  نوع خودرو
                </span>
              </th>
              {/* مدل خودرو 10 */}
              <th className="bg-primary/25 w-[10%] !p-1">
                <span className={`font-normal text-sm whitespace-nowrap`}>
                  مدل
                </span>
              </th>
              {/* پلاک 15 */}
              <th className="bg-primary/25 w-[15%] !p-1">
                <span className={`font-normal text-sm whitespace-nowrap`}>
                  پلاک
                </span>
              </th>
              {/* شماره شاسی 15 */}
              <th className="bg-primary/25 w-[15%] !p-1">
                <span className={`font-normal text-sm whitespace-nowrap`}>
                  شماره شاسی(VIN)
                </span>
              </th>
              {/* شماره موتور 15 */}
              <th className="bg-primary/25 w-[15%] !p-1">
                <span className={`font-normal text-sm whitespace-nowrap`}>
                  شماره موتور
                </span>
              </th>
              {/* رنگ 10 */}
              <th className="bg-primary/25 w-[10%] !p-1">
                <span className={`font-normal text-sm whitespace-nowrap`}>
                  رنگ
                </span>
              </th>
              {/* بهره‌بردار 10 */}
              <th className="bg-primary/25 w-[10%] !p-1">
                <span className={`font-normal text-sm whitespace-nowrap`}>
                  بهره‌بردار
                </span>
              </th>
              {/* راننده 10 */}
              <th className="bg-primary/25 w-[10%] !p-1 rounded-tl-xl">
                <span className={`font-normal text-sm whitespace-nowrap`}>
                  راننده
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8}>
                  <div className="h-[250px] w-full flex items-center justify-center bg-white">
                    <PiCircleNotch className="animate-spin text-4xl text-primary" />
                  </div>
                </td>
              </tr>
            ) : data?.length < 1 ? (
              <tr>
                <td colSpan={8}>
                  <div className="py-5 flex flex-col items-center gap-3">
                    <div className="flex justify-center">
                      <img
                        src="/assets/images/not-found.svg"
                        alt="موردی یافت نشد..."
                      />
                    </div>
                    <h2 className="text-center text-neutral-500 text-base">
                      موردی یافت نشد...
                    </h2>
                  </div>
                </td>
              </tr>
            ) : (
              data?.map((vehicle: VehicleType, index: number) => {
                const rowNumber =
                  (Number(currentPage) - 1) * Number(limit) + index + 1;
                return (
                  <VehicleListItem
                    vehicle={vehicle}
                    key={vehicle?.vin}
                    row={rowNumber}
                  />
                );
              })
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

export default VehicleList;
