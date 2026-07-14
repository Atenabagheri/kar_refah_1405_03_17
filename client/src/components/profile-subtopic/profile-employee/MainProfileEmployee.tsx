import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../../../../api/axios";
import type { EmployeeType } from "../../../types/types";
import ProfileEmployee from "./ProfileEmployee";
import { handleApiError } from "../../../utils/handleApiError";
import { useAppSelector } from "../../../redux/hooks";
import LoadingTopic from "../../../LoadingTopic";
import AccessDenied from "../../../pages/AccessDenied";

const MainProfileEmployee = () => {
  const { id } = useParams();
  const { user, token } = useAppSelector((state) => state.auth);
  const [data, setData] = useState<EmployeeType | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!id || !token) return;
    const getData = async () => {
      try {
        const res = await api.get(
          `/api/employee/get-employee-with-national-id/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // console.log(res?.data);;
        setData(res?.data);
      } catch (error) {
        handleApiError(error);
        console.log(error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id, token]);

  return user?.roles === "MHQO" ? (
    loading ? (
      <LoadingTopic />
    ) : data === null ? (
      <p className="text-center !pt-10 text-secondary font-bold">
        موردی یافت نشد.
      </p>
    ) : (
      <ProfileEmployee data={data} />
    )
  ) : (
    <AccessDenied />
  );
};

export default MainProfileEmployee;
