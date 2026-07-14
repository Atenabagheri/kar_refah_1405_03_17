import type { PositionType, TotalPageType } from "../../../types/types";
import PositionList from "./PositionList";
import { useFetch } from "../../../hooks/useFetch";
import { useQuery } from "../../../hooks/useQuery";
import Search from "../../../ui/Search";
import { useAppSelector } from "../../../redux/hooks";

interface DataList extends TotalPageType {
  data: PositionType[];
}

const MainPositionList = () => {
  const { get } = useQuery();
  const { deleteId } = useAppSelector((state) => state.ui);

  const s = get("search") ?? "";
  const page = get("page");
  const rows = get("rows");

  const { data: dataList, loading } = useFetch<DataList>({
    url: `/api/position/get-positions?page=${page}&limit=${rows}${s ? `&search=${s}` : ""}`,
    dependencies: [page, rows, s, deleteId],
    initialData: { data: [], total: 0, totalPages: 0, currentPage: 1 },
  });

  return (
    <div className="!py-4 !px-3 xl:!px-8 !space-y-4">
      <div className="flex items-center justify-between gap-2 w-full border-b border-b-dark/10 !pb-4">
        <Search placeholder="جستجو عنوان پست، کد و ..." />
      </div>

      <p className="font-semibold text-dark/80">لیست سمت‌ها</p>
      <PositionList dataList={dataList} loading={loading} />
    </div>
  );
};

export default MainPositionList;
