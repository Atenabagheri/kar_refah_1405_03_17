import { useState } from "react";
import SubmitButton from "../../ui/SubmitButton";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import InputPasswordForm from "../../ui/InputPasswordForm";
import { updatePassword } from "../../redux/slices/auth/AuthSlice";
import toast from "react-hot-toast";

const MainChangePassword = () => {
  const dispatch = useAppDispatch();
  const { loadingUpdatePass } = useAppSelector((state) => state.auth);
  const [oldPassword, setOldPasword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPasword] = useState<string>("");
  const [check, setCheck] = useState<boolean>(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const requiredState = !confirmPassword || !oldPassword || !newPassword;
    const requiredLengthState =
      confirmPassword?.length < 6 ||
      oldPassword?.length < 6 ||
      newPassword?.length < 6;
    if (
      requiredState ||
      newPassword !== confirmPassword ||
      requiredLengthState
    ) {
      setCheck(true);
      return;
    }
    setCheck(false);
    const formData = {
      oldPassword,
      newPassword,
    };
    const res = await dispatch(updatePassword(formData));
    if ("meta" in res) {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success((res.payload as { message: string })?.message);
        resetValue();
      } else {
        toast.error(res.payload as string);
      }
    }
    console.log(res);
  };
  const resetValue = () => {
    setOldPasword("");
    setNewPassword("");
    setConfirmPasword("");
  };
  return (
    <div className="!p-4 flex flex-col gap-4">
      <span className="font-semibold text-lg text-dark/80">
        تغییر کلمه عبور
      </span>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[300px]">
        <InputPasswordForm
          name="oldPassword"
          title="کلمه عبور قبلی"
          onChange={(e) => setOldPasword(e.target.value)}
          check={check}
          placeholder="کلمه عبور قبلی"
          value={oldPassword}
        />
        <InputPasswordForm
          name="newPassword"
          title="کلمه عبور جدید"
          onChange={(e) => setNewPassword(e.target.value)}
          check={check}
          placeholder="کلمه عبور جدید"
          value={newPassword}
        />
        <InputPasswordForm
          name="confirmPassword"
          title="تکرار کلمه عبور جدید"
          onChange={(e) => setConfirmPasword(e.target.value)}
          check={check}
          placeholder="تکرار کلمه عبور جدید"
          value={confirmPassword}
        >
          {check && confirmPassword && newPassword !== confirmPassword && (
            <span className="text-xs text-danger">
              تکرار کلمه عبور اشتباه است
            </span>
          )}
        </InputPasswordForm>
        <SubmitButton isLoading={loadingUpdatePass} />
      </form>
    </div>
  );
};

export default MainChangePassword;
