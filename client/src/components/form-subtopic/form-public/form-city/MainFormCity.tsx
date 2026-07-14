import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../../../../../api/axios";
import type { CityType } from "../../../../types/types";
import FormCity from "./FormCity";

const MainFormCity = () => {
  const { name } = useParams();
  const [data, setData] = useState<CityType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    if (!name) return;
    const getData = async () => {
      try {
        const res = await api.get(`/api/city/get-city-with-name/${name}`);
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
    <FormCity data={data} />
  );
};

export default MainFormCity;
