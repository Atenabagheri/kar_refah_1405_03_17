import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../../../../api/axios";
import FormDateCategory from "./FormDateCategory";
import type { DateCategoryType } from "../../../types/types";

const MainFormDateCategory = () => {
    const { name } = useParams();
  const [data, setData] = useState<DateCategoryType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    if (!name) return;
    const getData = async () => {
      try {
        const res = await api.get(`/api/date-category/get-date-category-with-code/${name}`);
        // console.log(res?.data);;
        setData(res?.data);
      } catch (error) {
        console.log(error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [name]);
  return name && loading ? (
    <p className="text-center !pt-10 text-secondary font-bold">
      در حال بارگذاری...
    </p>
  ) : name && data === null ? (
    <p className="text-center !pt-10 text-secondary font-bold">
      موردی یافت نشد.
    </p>
  ) : (
    <FormDateCategory data={data} />
  );
}

export default MainFormDateCategory