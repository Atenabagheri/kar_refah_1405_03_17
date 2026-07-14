import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../../../../api/axios";
import FormUnitPost from "./FormUnitPost";
import type { UnitPostType } from "../../../types/types";

const MainFormUnitPost = () => {
  const { dateCategory, name } = useParams();
  const [data, setData] = useState<UnitPostType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    if (!name) return;
    const getData = async () => {
      try {
        const res = await api.get(
          `/api/unit-position/get-unit-position-with-county-name/${dateCategory}/${name}`
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
  }, [dateCategory, name]);
  return name && loading ? (
    <p className="text-center !pt-10 text-secondary font-bold">
      در حال بارگذاری...
    </p>
  ) : name && data === null ? (
    <p className="text-center !pt-10 text-secondary font-bold">
      موردی یافت نشد.
    </p>
  ) : (
    <FormUnitPost data={name ? data : null} />
  );
};

export default MainFormUnitPost;
