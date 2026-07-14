import { useEffect, useState } from "react";
import api from "../../../../api/axios";
import { handleApiError } from "../../../utils/handleApiError";
import type { AssetsType } from "../../../types/types";
import { useParams } from "react-router";
import ProfileAsset from "./ProfileAsset";

const MainProfileAsset = () => {
  const { id } = useParams();
  const [data, setData] = useState<AssetsType | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!id) return;
    const getData = async () => {
      try {
        const res = await api.get(
          `/api/asset/get-asset-with-serial-number/${id}`
        );
        // // console.log(res?.data);;
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
    <ProfileAsset data={data} />
  );
};

export default MainProfileAsset;
