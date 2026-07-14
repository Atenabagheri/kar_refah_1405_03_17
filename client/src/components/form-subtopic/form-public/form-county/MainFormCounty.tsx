import { useEffect, useState } from "react";
import api from "../../../../../api/axios";
import { useParams } from "react-router";
import type { CountyType } from "../../../../types/types";
import FormCounty from "./FormCounty";

const MainFormCounty = () => {
  const { name } = useParams();
  const [data, setData] = useState<CountyType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    if (!name) return;
    const getData = async () => {
      try {
        const res = await api.get(`/api/county/get-county-with-name/${name}`);
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
    <FormCounty data={data} />
  );
};

export default MainFormCounty;
