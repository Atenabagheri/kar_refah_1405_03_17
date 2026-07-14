import { useCallback, useState } from "react";
import type { MeterListType, TotalPageType } from "../../../../types/types";
import { useQuery } from "../../../../hooks/useQuery";
import RowView from "../../../../ui/RowView";
import Pagination from "../../../../ui/Pagination";
import SingleRow from "../SingleRow";
import MainElectricityBills from "../energy/electrictity/MainElectricityBills";
import { useFetch } from "../../../../hooks/useFetch";
import CounterList from "../../../../ui/CounterList";
import { useAppSelector } from "../../../../redux/hooks";

interface DataList extends TotalPageType {
  data: MeterListType[];
}
const MainElectricity = () => {
  const { get } = useQuery();
  const { deleteId } = useAppSelector((state) => state.ui);

  const { token } = useAppSelector((state) => state.auth);
  const t = get("type") ?? "";
  const p = get("p") ?? "";
  const page = get("page");
  const rows = get("rows");
  const m = get("meter");

  const [currentPage, setCurrentPage] = useState(page || 1);
  const [limit, setLimit] = useState(rows ? rows : 10);
  const [serialNumberSelect, setSerialNumberSelect] = useState<string | null>(
    null,
  );
  const [billIdentifier, setBillIdentifier] = useState<string | null>(null);

  const { data: dataList, loading } = useFetch<DataList>({
    url: `/api/electricity-meter/get-electricity-meters?page=${page}&limit=${rows}${t ? `&type=${t}` : ""}${p ? `&province=${p}` : ""}`,
    dependencies: [token, page, rows, t, p, deleteId],
    initialData: { data: [], total: 0, totalPages: 0, currentPage: 1 },
  });

  const data = dataList?.data;
  const total = dataList?.total;
  const totalPages = dataList?.totalPages;

  const closeHandler = useCallback(() => {
    setSerialNumberSelect(null);
    setBillIdentifier(null);
  }, []);

  return loading ? (
    <div className="h-full w-full flex items-center justify-center">
      <span>درحال بارگذاری...</span>
    </div>
  ) : (
    <div className="!space-y-4 !pb-5 !pr-3">
      {(!m || m === "electricity") && serialNumberSelect && (
        <MainElectricityBills
          closeHandler={closeHandler}
          serialNumberSelect={serialNumberSelect}
          billIdentifier={billIdentifier}
        />
      )}
      {/* table */}
      <div className="w-[90%] overflow-x-auto !p-3 !mx-auto">
        <table className="w-full table-fixed text-xs xl:text-sm rounded-tr-xl rounded-tl-xl bg-secondary/5">
          <thead>
            <tr className="rounded-tr-xl rounded-tl-xl">
              <th className="bg-primary/25 w-[10%] !p-1 relative rounded-tr-xl">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  ردیف
                </span>
              </th>
              <th className="bg-primary/25 w-[20%] !p-1 relative">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  شماره بدنه کنتور
                </span>
              </th>
              <th className="bg-primary/25 w-[20%] !p-1 relative">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  شناسه قبض
                </span>
              </th>

              {/* <th className="bg-primary/25 w-[15%] !p-1 relative">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  نوع
                </span>
              </th>
 */}
              <th className="bg-primary/25 w-[15%] !p-1 relative">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  استان
                </span>
              </th>
              <th className="bg-primary/25 w-[15%] !p-1 relative">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  شهرستان/شهر
                </span>
              </th>
              <th className="bg-primary/25 w-[20%] !p-1 relative rounded-tl-xl">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  محل
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {!dataList.data ? (
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
              dataList.data?.map((meter) => (
                <SingleRow
                  meterType="electricity"
                  meter={meter}
                  key={meter.serialNumber}
                  nembers={dataList.data.indexOf(meter) + 1}
                  setSerialNumberSelect={setSerialNumberSelect}
                  setBillIdentifier={setBillIdentifier}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {data?.length > 0 && (
        <div className="flex justify-between items-center w-[90%] !mx-auto">
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

export default MainElectricity;
