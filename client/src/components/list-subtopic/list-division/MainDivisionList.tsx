import { useEffect, useState } from "react";
import type { DivisionType } from "../../../types/types";
import { handleApiError } from "../../../utils/handleApiError";
import api from "../../../../api/axios";
import DivisionList from "./DivisionList";

const MainDivisionList = () => {
  const [data, setData] = useState<DivisionType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await api.get("/api/division/get-divisions");
        // console.log(res?.data);;
        setData(res?.data);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <div className="flex justify-center relative w-full">
      <div className="absolute -right-1 xl:right-10">
        <img
          src="/assets/images/logo.svg"
          alt="وزارت تعاون، کار و رفاه اجتماعی"
          width={200}
          height={200}
        />
      </div>
      {/* لیست */}
      <DivisionList data={data} loading={loading} />
    </div>
  );
};

export default MainDivisionList;
