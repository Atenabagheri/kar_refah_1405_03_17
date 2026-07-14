import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Modal from "./Modal";
import { signout } from "../redux/slices/auth/AuthSlice";
import toast from "react-hot-toast";
import { PiCircleNotch } from "react-icons/pi";
interface PropsType {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
const SignOutAlert = ({ setShow }: PropsType) => {
  const dispatch = useAppDispatch();
  const { loadingSignOut } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const signoutHandle = async () => {
    const res = await dispatch(signout());
    if (res.meta.requestStatus === "fulfilled") {
      setShow(false);
      navigate("/auth/login");
    } else {
      toast.error(res.payload as string);
    }
  };
  return (
    <Modal>
      <div className="w-[400px] !p-2.5 !py-5  bg-white rounded-md shadow-sm !space-y-8">
        <p className="font-semibold text-dark text-sm">
          آیا از خروج از حساب کاربری خود اطمینان داید؟
        </p>
        <div className="flex items-center justify-center gap-12">
          <button
            disabled={loadingSignOut}
            className="bg-danger/40 !p-2.5 w-[80px] rounded-md text-sm cursor-pointer relative"
            onClick={signoutHandle}
          >
            <span>بله</span>
            {loadingSignOut && (
              <div className="absolute top-1/2 -translate-y-1/2 left-2 animate-spin text-sm disabled:cursor-not-allowed">
                <PiCircleNotch />
              </div>
            )}
          </button>
          <button
            disabled={loadingSignOut}
            className="bg-secondary/20 !p-2.5 w-[80px] rounded-md text-sm cursor-pointer disabled:cursor-not-allowed"
            onClick={() => setShow(false)}
          >
            خیر
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SignOutAlert;
