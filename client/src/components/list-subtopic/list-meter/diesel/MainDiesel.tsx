import { useCallback, useEffect, useState } from "react";
import type {
  BuildingType,
  DieselType,
  TotalPageType,
} from "../../../../types/types";
import { useQuery } from "../../../../hooks/useQuery";
import SingleRow from "./SingleRow";
import RowView from "../../../../ui/RowView";
import Pagination from "../../../../ui/Pagination";
import { useFetch } from "../../../../hooks/useFetch";
import CounterList from "../../../../ui/CounterList";
import MainProfileDiesel from "./profile-diesel/MainProfileDiesel";
import FilterBuilding from "../../../../ui/FilterBuilding";
import { useAppSelector } from "../../../../redux/hooks";
// import MainProfileDiesel from "./profile-diesel/MainProfileDiesel";

interface DataList extends TotalPageType {
  data: DieselType[];
  buildings: BuildingType[];
}

const MainDiesel = () => {
  const { get } = useQuery();
  const { deleteId } = useAppSelector((state) => state.ui);

  const { token } = useAppSelector((state) => state.auth);
  const t = get("type") ?? "";
  const postalCode = get("postalCode") ?? "";
  const p = get("p") ?? "";
  const page = get("page");
  const rows = get("rows");
  const m = get("meter");

  const [currentPage, setCurrentPage] = useState(page || 1);
  const [limit, setLimit] = useState(rows ? rows : 10);
  const [documentNumberSelect, setDocumentNumberSelect] = useState<
    string | null
  >(null);

  const { data: dataList, loading } = useFetch<DataList>({
    url: `/api/diesel/get-diesels?page=${page}&limit=${rows}${t ? `&type=${t}` : ""}${p ? `&province=${p}` : ""}${postalCode ? `&postalCode=${postalCode}` : ""}`,
    dependencies: [token, page, rows, t, p, postalCode, deleteId],
    initialData: {
      data: [],
      buildings: [],
      total: 0,
      totalPages: 0,
      currentPage: 1,
    },
  });

  const data = dataList?.data;
  const total = dataList?.total;
  const totalPages = dataList?.totalPages;
  const buildingList = dataList?.buildings;

  const closeHandler = useCallback(() => {
    setDocumentNumberSelect(null);
  }, []);

  useEffect(() => {
    if (documentNumberSelect && deleteId?.endsWith(`/delete-diesel/${documentNumberSelect}`)) {
      closeHandler();
    }
  }, [deleteId, closeHandler, documentNumberSelect]);
  return loading ? (
    <div className="h-full w-full flex items-center justify-center">
      <span>درحال بارگذاری...</span>
    </div>
  ) : (
    <div className="!space-y-4 !pb-5 !pr-3">
      {m === "diesel" && documentNumberSelect && (
        <MainProfileDiesel
          closeHandler={closeHandler}
          documentNumberSelect={documentNumberSelect}
        />
      )}
      {/* table */}
      <div className="w-[100%] overflow-x-auto !p-3 !mx-auto !space-y-4">
        <FilterBuilding title="محل تخلیه: " bulidings={buildingList} />
        <table className="w-full table-fixed text-xs xl:text-sm rounded-tr-xl rounded-tl-xl bg-secondary/5">
          <thead>
            <tr className="rounded-tr-xl rounded-tl-xl">
              {/* ردیف 5 */}
              <th className="bg-primary/25 w-[5%] !p-1 relative rounded-tr-xl">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  ردیف
                </span>
              </th>
              {/* تاریخ خرید 15 */}
              <th className="bg-primary/25 w-[15%] !p-1 relative">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  تاریخ خرید
                </span>
              </th>
              {/* شماره نیاز 20 */}
              <th className="bg-primary/25 w-[20%] !p-1 relative">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  شماره نیاز
                </span>
              </th>
              {/* محل تخلیه 30 */}
              <th className="bg-primary/25 w-[30%] !p-1 relative">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  محل تخلیه
                </span>
              </th>
              {/* میزان خرید 15 */}
              <th className="bg-primary/25 w-[15%] !p-1 relative">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  میزان خرید(لیتر)
                </span>
              </th>
              {/* مبلغ خرید 15 */}
              <th className="bg-primary/25 w-[15%] !p-1 relative">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  مبلغ خرید(ریال)
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
              dataList.data?.map((d) => (
                <SingleRow
                  data={d}
                  key={d.documentNumber}
                  nembers={dataList.data.indexOf(d) + 1}
                  setDocumentNumberSelect={setDocumentNumberSelect}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      {data?.length > 0 && (
        <div className="flex justify-between items-center w-[90%] mx-auto">
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

export default MainDiesel;
