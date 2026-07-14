import { useFetch } from "../../../hooks/useFetch";
import { useQuery } from "../../../hooks/useQuery";
import LoadingTopic from "../../../LoadingTopic";
import { useAppSelector } from "../../../redux/hooks";
import type { EmployeeType, TotalPageType } from "../../../types/types";
import Search from "../../../ui/Search";
import MainUploadExcel from "../../upload-excel/MainUploadExcel";
import EmployeeList from "./EmployeeList";

interface DataList extends TotalPageType {
  data: EmployeeType[];
}

const MainEmployeeList = () => {
  const { deleteId } = useAppSelector((state) => state.ui);
  const { get } = useQuery();
  const { user } = useAppSelector((state) => state.auth);

  const s = get("search") ?? "";
  const page = get("page");
  const rows = get("rows");

  const { data, loading, error } = useFetch<DataList>({
    url: `/api/employee/get-employees?page=${page}&limit=${rows}${s ? `&search=${s}` : ""}`,
    dependencies: [page, rows, s, deleteId],
    initialData: { data: [], total: 0, totalPages: 0, currentPage: 1 },
  });
  return loading ? (
    <LoadingTopic />
  ) : error ? (
    <div className="flex items-center justify-center h-full w-full">
      <p className="text-dark text-sm font-bold">{error}</p>
    </div>
  ) : (
    <div className="!py-4 !px-3 xl:!px-8 !space-y-4">
      <div className="flex items-center justify-between gap-2 w-full border-b border-b-dark/10 !pb-4">
        <Search placeholder="جستجو نام، کد ملی یا شماره تماس..." />
      </div>

      <p className="font-semibold text-dark/80">لیست افراد</p>
      {/* لیست */}
      <EmployeeList dataList={data} loading={loading} />
      {/* فرم */}
      {user?.isAdmin && (
        <div className="flex flex-col items-start gap-4">
          <MainUploadExcel url="/api/employee/upload" fileName="employee" />
        </div>
      )}
    </div>
  );
};

export default MainEmployeeList;
