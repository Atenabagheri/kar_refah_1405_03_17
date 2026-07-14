import AssetList from "./AssetList";
import { useFetch } from "../../../hooks/useFetch";
import { useQuery } from "../../../hooks/useQuery";
import { useAppSelector } from "../../../redux/hooks";
import type { AssetsType, TotalPageType } from "../../../types/types";
import Search from "../../../ui/Search";
import MainUploadExcel from "../../upload-excel/MainUploadExcel";
import TemplateDownload from "../../../ui/TemplateDownload";
import FilterCategory from "./FilterCategory";

interface DataList extends TotalPageType {
  data: AssetsType[];
}

const MainAssetList = () => {
  const { get } = useQuery();
  const { user } = useAppSelector((state) => state.auth);
  const { deleteId } = useAppSelector((state) => state.ui);

  const s = get("search") ?? "";
  const category = get("category") ?? "";
  const page = get("page");
  const rows = get("rows");

  const { data: dataList, loading } = useFetch<DataList>({
    url: `/api/asset/get-assets?page=${page}&limit=${rows}${s ? `&search=${s}` : ""}${category ? `&category=${category}` : ""}`,
    dependencies: [page, rows, s, category, deleteId],
    initialData: { data: [], total: 0, totalPages: 0, currentPage: 1 },
  });

  return (
    <div className="!py-4 !px-3 xl:!px-8 !space-y-4">
      <div className="flex items-center justify-between gap-2 w-full border-b border-b-dark/10 !pb-4">
        <Search placeholder="جستجو عنوان دارایی، شماره سریال و ..." />
        <FilterCategory
          label="دسته‌بندی"
          url="/api/asset-category/get-asset-categories"
        />
      </div>

      <p className="font-semibold text-dark/80">لیست دارایی ها</p>
      <AssetList dataList={dataList} loading={loading} />
      {user?.isAdmin && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <MainUploadExcel
              url="/api/asset/upload"
              fileName="asset"
              title="بارگزاری لیست اموال"
            />
            <MainUploadExcel
              url="/api/asset-category/upload"
              fileName="assetCategory"
              title="بارگزاری دسته‌بندی اموال"
            />
          </div>
          <div className="flex items-center gap-1">
            <TemplateDownload title="اموال" fileName="asset.xlsx" />
            <TemplateDownload
              title="دسته‌بندی اموال"
              fileName="assetCategory.xlsx"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainAssetList;
