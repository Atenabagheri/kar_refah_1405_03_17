import { useCallback, useState, type ChangeEvent } from "react";
import api from "../../../api/axios";
import { PiCircleNotch, PiUploadSimple } from "react-icons/pi";
import type { EmployeeType } from "../../types/types";
import TableExcel from "./TableExcel";

type JsonDataType = {
  jsonData: EmployeeType[];
  message: string;
} | null;

type Props = {
  url: string;
  fileName?: string;
  title?: string;
};
const MainUploadExcel = ({ url, fileName, title = "بارگزاری فایل" }: Props) => {
  const [jsonData, setJsonData] = useState<JsonDataType>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (
        file.name !== fileName + ".xls" &&
        file.name !== fileName + ".xlsx" &&
        file.name !== fileName + ".numbers"
      ) {
        setError(
          `لطفاً فقط فایل ${fileName + `.xls`} یا ${fileName + `.xlsx`} یا ${fileName + `.numbers`} را انتخاب کنید.`
        );
        return;
      }
      setError("");

      const formData = new FormData();
      formData.append("file", file);
      try {
        setLoading(true);
        const res = await api.post(url, formData);
        // console.log(res?.data);;
        setJsonData(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        e.target.value = "";
      }
    },
    [url, fileName]
  );

  const closeTable = () => {
    setJsonData(null);
  };

  return (
    <div className="flex items-center justify-center">
      <label
        htmlFor={fileName}
        className={`flex items-center justify-center gap-2 rounded-md outline-1 !p-1.5 min-w-32 relative cursor-pointer`}
      >
        {loading ? (
          <div className="flex items-center gap-1">
            <div className="flex items-center justify-center w-7 h-7 absolute left-1 top-1/2 -translate-y-1/2">
              <PiCircleNotch className="animate-spin text-neutral-500 text-xl" />
            </div>
            <span className="text-sm text-neutral-500">صبر کنید</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <PiUploadSimple className="text-xl" />
            <span className="text-sm">{title}</span>
          </div>
        )}

        <input
          disabled={loading}
          name="file"
          className="hidden"
          id={fileName}
          type="file"
          accept=".xlsx, .xls, .numbers"
          onChange={handleFileChange}
        />
      </label>
      {!loading && jsonData?.jsonData.length && (
        <TableExcel jsonData={jsonData.jsonData} closeTable={closeTable} />
      )}
      {error && (
        <p className="text-danger text-sm text-center !px-2">{error}</p>
      )}
    </div>
  );
};

export default MainUploadExcel;
