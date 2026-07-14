import { useSearchParams } from "react-router";

interface PropsType {
  setLimit: React.Dispatch<React.SetStateAction<string | number>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<string | number>>;
  limitX?: number;
  isDark?: boolean;
}

const RowView = ({
  setLimit,
  setCurrentPage,
  limitX = 1,
  isDark,
}: PropsType) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rows = searchParams.get("rows");
  return (
    <select
      onChange={(e) => {
        setLimit(e.target.value);
        setCurrentPage(1);
        // setSearchParams(new URLSearchParams(`?page=1&rows=${e.target.value}`));
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set("page", "1");
        newParams.set("rows", String(e.target.value));
        setSearchParams(newParams);
      }}
      defaultValue={rows ? rows : 10}
      className={`text-sm outline-1 outline-secondary !py-1 !px-2 rounded-md cursor-pointer ${isDark && "bg-dark"}`}
    >
      {rows &&
        limitX &&
        Number(rows) !== 10 * limitX &&
        Number(rows) !== 20 * limitX &&
        Number(rows) !== 30 * limitX && (
          <option value={Number(rows)}>ردیف {Number(rows)}</option>
        )}
      {rows &&
        !limitX &&
        Number(rows) !== 10 &&
        Number(rows) !== 20 &&
        Number(rows) !== 30 && (
          <option value={Number(rows)}>ردیف {Number(rows)}</option>
        )}

      <option value={10 * limitX}>ردیف {10 * limitX}</option>
      <option value={20 * limitX}>ردیف {20 * limitX}</option>
      <option value={30 * limitX}>ردیف {30 * limitX}</option>
    </select>
  );
};

export default RowView;
