import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import ProfileVehicle from "./ProfileVehicle";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchVehicle } from "../../../redux/slices/subtopics/vehicle/vehicleSlice";
import { PiCaretLeft } from "react-icons/pi";

const MainProfileVehicle = () => {
  const navigate = useNavigate();
  const { deleteId } = useAppSelector((state) => state.ui);

  const backHandler = () => {
    navigate(-1);
  };
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const { token } = useAppSelector((state) => state.auth);
  const { loading, data, error } = useAppSelector((state) => state.vehicle);

  const vehicle = data?.vehicle;

  useEffect(() => {
    if (!id || !token) return;
    dispatch(fetchVehicle({ id, token }));
  }, [dispatch, id, token, deleteId]);

  return loading ? (
    <p className="text-center !pt-10 text-secondary font-bold">
      در حال بارگذاری...
    </p>
  ) : vehicle === null ? (
    <p className="text-center !pt-10 text-secondary font-bold">
      موردی یافت نشد.
    </p>
  ) : error ? (
    <div className="h-full flex flex-col gap-0 justify-center relative">
      <button
        onClick={backHandler}
        className="flex items-center gap-1 cursor-pointer absolute left-4 top-4"
      >
        <span>بازگشت</span>
        <PiCaretLeft />
      </button>

      <p className="text-center !pt-10 text-secondary font-bold">{error}</p>
    </div>
  ) : (
    <ProfileVehicle />
  );
};

export default MainProfileVehicle;
