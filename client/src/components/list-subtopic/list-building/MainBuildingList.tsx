import { useAppSelector } from "../../../redux/hooks";
import BuildingList from "./BuildingList";
import type { BuildingType } from "../../../types/types";
import MainUploadExcel from "../../upload-excel/MainUploadExcel";
import FilterType from "../../../ui/FilterType";
import { useFetch } from "../../../hooks/useFetch";
import { useQuery } from "../../../hooks/useQuery";
import ProvinceSelector from "../../../ui/ProvinceSelector";
import TemplateDownload from "../../../ui/TemplateDownload";
import Search from "../../../ui/Search";

type DataList = {
  data: BuildingType[];
  total?: number;
  totalPages?: number;
  currentPage?: number;
};
const MainBuildingList = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { deleteId } = useAppSelector((state) => state.ui);

  const { get } = useQuery();
  const p = get("p");
  const t = get("type");
  const s = get("search") ?? "";
  const page = get("page");
  const rows = get("rows");

  const { data, loading } = useFetch<DataList>({
    url: `/api/building/get-buildings-with-roles?page=${page}&limit=${rows}${t ? `&type=${t}` : ""}${p ? `&province=${p}` : ""}${s ? `&search=${s}` : ""}`,
    // token,
    dependencies: [page, rows, t, p, s, deleteId],
    initialData: { data: [], total: 0, totalPages: 0, currentPage: 1 },
  });

  return (
    <div className="!py-4 !px-3 xl:!px-8 !space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 w-full border-b border-b-dark/10 !pb-4">
        <Search placeholder="جستجو ساختمان..." />
        {user?.roles === "MHQO" && (
          <div className="flex flex-col md:flex-row-reverse items-center gap-2">
            <FilterType />
            <ProvinceSelector />
          </div>
        )}
      </div>

      <p className="font-semibold text-dark/80">لیست ساختمان‌ها</p>

      <BuildingList data={data} loading={loading} />
      {user?.isAdmin && (
        <div className="flex flex-col items-start gap-4">
          <MainUploadExcel url="/api/building/upload" fileName="building" />
          <TemplateDownload title="ساختمان‌ها" fileName="building.xlsx" />
        </div>
      )}
    </div>
  );
};

export default MainBuildingList;
