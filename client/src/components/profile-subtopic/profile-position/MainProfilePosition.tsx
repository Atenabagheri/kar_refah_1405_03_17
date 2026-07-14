import { useEffect, useState } from "react";
import api from "../../../../api/axios";
import { handleApiError } from "../../../utils/handleApiError";
import { useParams } from "react-router";
import type { PositionType } from "../../../types/types";
import ProfilePosition from "./ProfilePosition";

const MainProfilePosition = () => {
  const { id } = useParams();
  const [data, setData] = useState<PositionType | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!id) return;
    const getData = async () => {
      try {
        const res = await api.get(
          `/api/position/get-position-with-position-code/${id}`
        );
        // console.log(res?.data);;
        setData(res?.data);
      } catch (error) {
        handleApiError(error);
        setData(null);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id]);
  return id && loading ? (
    <p className="text-center !pt-10 text-secondary font-bold">
      در حال بارگذاری...
    </p>
  ) : data === null ? (
    <p className="text-center !pt-10 text-secondary font-bold">
      موردی یافت نشد.
    </p>
  ) : (
    <ProfilePosition data={data} />
  );
};

export default MainProfilePosition;
