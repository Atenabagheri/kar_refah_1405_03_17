import { useEffect, useState } from "react";
import api from "../../../../../api/axios";
import { PiArrowClockwiseBold, PiCircleNotch, PiX } from "react-icons/pi";
import Modal from "../../../../ui/Modal";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import toast from "react-hot-toast";
import { handleApiError } from "../../../../utils/handleApiError";
import type { AxiosError } from "axios";
import { setDeleteButton } from "../../../../redux/slices/ui/uiSlices";

type PropsType = {
  token?: string;
  billIdentifier?: string | null;
  serial_number?: string;
};
type BillType<T> = {
  data?: T | null;
  message?: string;
};

type BillData = {
  serial_number: string;
  bill_identifier: string;
  payment_identifier: string;
  total_bill_debt: string;
  avg_usage_step: string;
  total_use: string;
};
const GetElectricityBill = ({ billIdentifier }: PropsType) => {
  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [tokenApi, setTokenApi] = useState("");
  const [year, setYear] = useState<string>("1402");
  const [showInput, setShowInput] = useState(false);

  const getToken = async () => {
    try {
      const res = await api.get(`/api/settings/token`);
      // console.log(res?.data);;
      if (res.data.data) {
        setTokenApi(res.data.data);
      }
    } catch (error) {
      console.log(error);
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message as string);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  const fetchData = async () => {
    if (!billIdentifier || !year || !tokenApi) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await api.post<BillType<BillData>>(
        `/api/electricity-bill/get-bill`,
        {
          payload: { bill_identifier: billIdentifier, FromYear: year },
          tokenApi,
        },
        {
          headers: { Authorization: `Bearer ` + token },
        },
      );
      // console.log(res?.data);;
      setShowInput(false);
      toast.success(res?.data?.message as string);
      dispatch(setDeleteButton(billIdentifier));
    } catch (error) {
      console.log(error);
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowInput(true)}
        className="bg-primary rounded-full !p-1.5 text-white cursor-pointer"
      >
        <PiArrowClockwiseBold className={`${loading && "animate-spin"}`} />
      </button>
      {showInput && (
        <Modal>
          <div className="bg-white !p-8 rounded-lg flex flex-col gap-4 relative">
            <button
              onClick={() => !loading && setShowInput(false)}
              className="text-dark absolute left-2 top-2 cursor-pointer"
            >
              <PiX />
            </button>
            <p className="text-dark text-sm text-center">دریافت قبض جدید</p>
            <input
              className="bg-white !p-2 rounded-lg shadow-md"
              onChange={(e) => setYear(e.target.value)}
              value={year || ""}
              disabled={loading}
            />
            <button
              disabled={loading}
              onClick={fetchData}
              className="bg-primary text-white rounded-lg !p-2 cursor-pointer flex items-center justify-center gap-1 disabled:cursor-default disabled:bg-dark/50"
            >
              بروزرسانی
              {loading && <PiCircleNotch className="animate-spin" />}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default GetElectricityBill;
