import React, { useState } from "react";
import { PiCircleNotch, PiTrashSimple } from "react-icons/pi";

import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { useAppDispatch } from "../../../redux/hooks";
import api from "../../../../api/axios";
import { setDeleteButton } from "../../../redux/slices/ui/uiSlices";

interface IDeleteMeter {
  url: string;
  showModal: string | null;
  setShowModal: React.Dispatch<React.SetStateAction<string | null>>;
}
const DeleteComponent = ({
  url,
  showModal,
  setShowModal,
}: IDeleteMeter) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const deleteHandler = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!url) return;
    try {
      setLoading(true);
      const res = await api.delete(`${url}`);
      // console.log(res?.data);;
      toast.success(res.data.message);
      setShowModal(null);
      dispatch(setDeleteButton(url));
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.log(error);
      toast.error(err.response?.data?.message as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <p className="text-right">
        آیا با حذف{" "}
        <span className="underline underline-offset-8 font-bold">
          بیمه نامه با کد یکتا {showModal}
        </span>{" "}
        موافق هستید؟
      </p>
      <div className="flex items-center gap-6">
        <button
          onClick={deleteHandler}
          className="bg-danger text-white text-sm !p-2 rounded-lg cursor-pointer flex items-center gap-2"
        >
          <span>بله، حذف شود</span>
          {loading ? (
            <PiCircleNotch className="text-xl text-white animate-spin" />
          ) : (
            <PiTrashSimple className="text-xl text-white" />
          )}
        </button>
        <button
          onClick={() => setShowModal(null)}
          className="cursor-pointer !p-2"
        >
          لغو
        </button>
      </div>
    </div>
  );
};

export default DeleteComponent;
