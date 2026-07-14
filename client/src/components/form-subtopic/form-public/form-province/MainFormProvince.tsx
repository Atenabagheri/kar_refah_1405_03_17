import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../../../../../api/axios";
import FormProvince from "./FormProvince";
import type { ProvinceType } from "../../../../types/types";

const MainFormProvince = () => {
  const { name } = useParams();
  const [data, setData] = useState<ProvinceType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    if (!name) return;
    const getData = async () => {
      try {
        const res = await api.get(
          `/api/province/get-province-with-name/${name}`
        );
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
    <FormProvince data={data} />
  );
};

export default MainFormProvince;
