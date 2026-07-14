import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../../../../api/axios";
import { handleApiError } from "../../../utils/handleApiError";
import type { RoomsProfileType } from "../../../types/types";
import ProfileRoom from "./ProfileRoom";

const MainProfileRoom = () => {
  const { id } = useParams();
  const [data, setData] = useState<RoomsProfileType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    if (!id) return;
    const getData = async () => {
      try {
        const res = await api.get(`/api/room/get-room-with-number/${id}`);
        // console.log(res?.data);;
        setData(res?.data);
      } catch (error) {
        handleApiError(error);
        setData(null);
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
    <ProfileRoom data={data} />
  );
};

export default MainProfileRoom;
