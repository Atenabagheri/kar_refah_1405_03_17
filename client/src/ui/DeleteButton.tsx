import { PiCircleNotch, PiTrashSimple } from "react-icons/pi";
import api from "../../api/axios";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import { setDeleteButton } from "../redux/slices/ui/uiSlices";
import { useNavigate } from "react-router";
import Modal from "./Modal";

const DeleteButton = ({
  url,
  origin = "list",
  title,
  className,
  // showModal,
  // setShowModal,
}: {
  url: string;
  origin?: "list" | "profile";
  title?: string;
  className?: string;
  // showModal: boolean;
  // setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);

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
      if (origin === "list") {
        dispatch(setDeleteButton(url));
      } else if (
        origin === "profile" &&
        !url.includes("green-meter") &&
        !url.includes("bill") &&
        !url.includes("diesel")
      ) {
        dispatch(setDeleteButton(url));
        navigate(-1);
      }
      dispatch(setDeleteButton(url));
      setShowModal(false);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.log(error);
      toast.error(err.response?.data?.message as string);
    } finally {
      setLoading(false);
    }
  };

  const modalHandler = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setShowModal(true);
  };
  const cancelModalHandler = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setShowModal(false);
  };
  return showModal ? (
    <Modal className="min-w-[360px] bg-white rounded-xl !p-4 z-9999">
      <div className="flex flex-col gap-8">
        <p className="text-right">
          آیا با حذف{" "}
          <span className="underline underline-offset-8 font-bold">
            {title}
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
          <button onClick={cancelModalHandler} className="cursor-pointer !p-2">
            لغو
          </button>
        </div>
      </div>
    </Modal>
  ) : (
    <button
      disabled={loading}
      onClick={modalHandler}
      className={`${origin === "list" ? "absolute left-2 top-1/2 -translate-y-1/2" : ""}  hover:bg-danger/20 rounded-md !p-1 cursor-pointer ${className}`}
    >
      {loading ? (
        <PiCircleNotch className="text-xl text-danger animate-spin" />
      ) : (
        <PiTrashSimple className="text-xl text-danger" />
      )}
    </button>
  );
};

export default DeleteButton;
