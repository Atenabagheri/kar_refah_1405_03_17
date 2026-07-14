import { useEffect, useRef, useState } from "react";
import api from "../../../../api/axios";
import { handleApiError } from "../../../utils/handleApiError";
import { convertDateToFaWithTime } from "../../../helper/convertDateToFaWithTime";
import { useSearchParams } from "react-router";
import Pagination from "../../../ui/Pagination";
import RowView from "../../../ui/RowView";

type LogType = {
  _id: string;
  employee: string | null;
  action: string;
  status: string;
  ip: string;
  userAgent: string;
  createdAt: string;
};
type DataLogType = {
  data: LogType[];
  total?: number;
  totalPages?: number;
  currentPage?: number;
};
const MainLogAuth = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [searchParams] = useSearchParams();

  const [logsData, setLogsData] = useState<DataLogType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const page = searchParams.get("page");
  const rows = searchParams.get("rows");
  const [currentPage, setCurrentPage] = useState(page || 1);
  const [limit, setLimit] = useState(rows ? rows : 100);

  const lastIndex = +currentPage * +limit;
  const firstIndex = lastIndex - +limit;

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await api.get(
          `/api/log-auth/get-logs-auth?page=${page}&limit=${limit}`
        );

        // console.log(res?.data);;
        setLogsData(res.data);
        if (scrollRef.current) {
          scrollRef.current.scrollTo({ top: 0, behavior: "auto" });
        }
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [page, limit]);

  return loading ? (
    <div className="h-full w-full flex items-center justify-center">
      <span>درحال بارگذاری...</span>
    </div>
  ) : logsData?.data.length === 0 ? (
    <div className="h-full w-full flex items-center justify-center">
      <span>لاگ وجود ندارد</span>
    </div>
  ) : (
    <div className="h-full w-full flex flex-col gap-0 max-h-full">
      <div className="text-center flex items-center justify-between !px-1 !py-2 font-bold text-sm border-b border-b-neutral-900 last:border-none bg-neutral-900 text-light">
        <span className="basis-[5%]">ردیف</span>
        <span className="basis-[10%]">زمان</span>
        <span className="basis-[10%]">کاربر</span>
        <span className="basis-[10%]">ای پی سیستم</span>
        <span className="basis-[10%]">فعالیت</span>
        <span className="basis-[10%]">عملیات</span>
        <span className="basis-[45%]">سیستم عامل</span>
      </div>
      <div
        ref={scrollRef}
        className="h-full w-full flex flex-col gap-2 overflow-y-auto bg-dark !pt-1"
      >
        {logsData?.data.map((log: LogType, index: number) => {
          const rowNumber =
            (Number(currentPage) - 1) * Number(limit) + index + 1;
          return (
            <div
              key={log._id}
              className="text-center flex items-center justify-between !p-1 text-sm border-b border-b-neutral-600 last:border-none text-light"
            >
              <span className="basis-[5%]">{rowNumber}</span>
              <span className="basis-[10%]">
                {convertDateToFaWithTime(log.createdAt)}
              </span>
              <span className="basis-[10%]">{log?.employee}</span>
              <span className="basis-[10%]">{log?.ip}</span>
              <span className="basis-[10%]">
                {log?.action === "login"
                  ? "ورود به سیستم"
                  : log?.action === "logout"
                    ? "خروج از سیستم"
                    : log?.action === "update-password" && "تغییر کلمه عبور"}
              </span>
              <span className="basis-[10%]">{log?.status}</span>
              <span className="basis-[45%] font-sans text-left">
                {log?.userAgent}
              </span>
            </div>
          );
        })}
      </div>
      {Number(logsData?.data.length) > 0 && (
        <div className="flex justify-between items-center max-w-full !px-4 bg-dark border-t border-t-neutral-500 text-light">
          <RowView
            setLimit={setLimit}
            setCurrentPage={setCurrentPage}
            limitX={10}
            isDark
          />

          <Pagination
            className="flex items-center justify-center gap-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent text-light w-fit"
            currentPage={Number(currentPage)}
            totalPages={Number(logsData?.totalPages)}
            setCurrentPage={setCurrentPage}
          />
          <div className="text-sm flex items-center gap-4">
            <span>نمایش {firstIndex + 1}</span>
            <span>
              تا {lastIndex - (+limit - Number(logsData?.data.length))}
            </span>
            <span>از کل {logsData?.total}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLogAuth;
