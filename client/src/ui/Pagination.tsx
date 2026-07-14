import { useEffect } from "react";
import { PiCaretLeft, PiCaretRight } from "react-icons/pi";
import { useSearchParams } from "react-router";
import { generatePagination } from "../utils/generatePagination";

interface PropsType {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<string | number>>;
  className?: string;
}

const Pagination = ({
  className,
  currentPage,
  totalPages,
  setCurrentPage,
}: PropsType) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rows = searchParams.get("rows");
  const p = searchParams.get("page");

  useEffect(() => {
    if (p === "1") setCurrentPage("1");
  }, [p,setCurrentPage]);

  const handlePageChange = (page: number | string) => {
    if (page !== "..." && page !== currentPage) {
      setCurrentPage(page);
      const newParams = new URLSearchParams(searchParams.toString());

      // page رو آپدیت کن
      newParams.set("page", String(page));

      // اگر rows داری، هم اضافه کن یا نگه دار (مثلا از state)
      // const rows = searchParams.get('rows');
      // if (rows) {
      //   newParams.set('rows', rows);
      // }

      // حالا با newParams کل پارامترها رو ست کن
      setSearchParams(newParams);
    }
  };

  const handlePage = () => {
    if (rows) {
      setSearchParams(new URLSearchParams(`?page=1&rows=${rows}`));
    } else {
      setSearchParams(new URLSearchParams(`?page=1`));
    }
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
      handlePage();
    }
  }, []);

  return (
    <div
      className={
        className ||
        "flex items-center justify-center gap-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent text-neutral-700 w-fit"
      }
    >
      {totalPages > 1 && currentPage > 1 && (
        <button
          className="h-10 w-10 text-xl flex items-center justify-center cursor-pointer"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <PiCaretRight />
        </button>
      )}
      {generatePagination(currentPage, totalPages).map((page, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(page)}
          disabled={page === "..." || page === currentPage}
          className={`w-10 h-10 ${
            page === currentPage ? "ring" : ""
          } ${page === "..." ? "cursor-default" : "cursor-pointer"}`}
        >
          {page}
        </button>
      ))}
      {totalPages > 1 && currentPage < totalPages && (
        <button
          className="h-10 w-10 text-xl flex items-center justify-center cursor-pointer"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <PiCaretLeft />
        </button>
      )}
    </div>
  );
};

export default Pagination;
