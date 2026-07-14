import { useState } from "react";
// import InputForm from "../../../ui/InputForm";
import { PiCircleNotch, PiEyeSlashDuotone, PiEyeDuotone } from "react-icons/pi";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import toast from "react-hot-toast";
import {
  // getAccess,
  getMeInfo,
  submitLogin,
} from "../../../redux/slices/auth/AuthSlice";
import { useNavigate } from "react-router";
import { useQuery } from "../../../hooks/useQuery";

const MainLogin = () => {
  const { get } = useQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const backLink = get("backLink");

  const { loadingLogin } = useAppSelector((state) => state.auth);

  const [nationalId, setNationalId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [type, setType] = useState<string>("password");
  const [check, setCheck] = useState<boolean>(false);
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const requiredState = !nationalId || !password;
    if (requiredState || password?.length < 6) {
      setCheck(true);
      return;
    }
    setCheck(false);
    const formData = {
      nationalId,
      password,
    };
    const res = await dispatch(submitLogin(formData));
    if ("meta" in res) {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success((res.payload as { message: string })?.message);
        await getUserInfo();
      } else {
        toast.error(res.payload as string);
      }
    }
    console.log(res);
  };
  // const getAccessToken = async () => {
  //   const res = await dispatch(getAccess());
  //   if ("meta" in res) {
  //     if (res.meta.requestStatus === "fulfilled") {
  //       await getUserInfo();
  //     } else {
  //       toast.error(res.payload as string);
  //     }
  //   }
  //   console.log(res);
  // };

  const getUserInfo = async () => {
    const res = await dispatch(getMeInfo());
    if ("meta" in res) {
      if (res.meta.requestStatus === "rejected") {
        toast.error(res.payload as string);
      } else {
        if (backLink) {
          navigate(backLink);
        } else {
          navigate("/dashboard/province");
        }
      }
    }
    console.log(res);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      setNationalId(newValue);
    }
  };

  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="border border-secondary/50 w-[75%] sm:w-[50%] md:w-[35%] lg:w-[30%] xl:w-[25%] 2xl:w-[20%] rounded-md !p-3 flex flex-col justify-between">
        <div className="w-full flex items-center justify-center">
          <img
            src="/assets/images/logo.svg"
            alt="سامانه معاونت توسعه مدیریت و منابع"
            width={256}
            height={256}
          />
        </div>
        <form onSubmit={submitHandler} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 items-start">
            <div className="flex items-center justify-between w-full">
              <label htmlFor={"nationalId"} className="text-sm text-dark">
                نام کاربری :
              </label>
              {check && !nationalId && (
                <span className="text-xs text-danger">
                  این فیلد الزامی است.
                </span>
              )}
            </div>
            <input
              className="border border-secondary/50 disabled:bg-secondary/10 disabled:cursor-not-allowed bg-white !p-1.5 rounded-md w-full text-sm placeholder:text-sm outline-none"
              type={"text"}
              name={"nationalId"}
              onChange={(e) => handleChange(e)}
              value={nationalId}
            />
          </div>

          <div className="flex flex-col gap-2 items-start">
            <div className="flex items-center justify-between w-full">
              <label htmlFor={"password"} className="text-sm text-dark">
                رمز عبور :
              </label>
              {check && !password && (
                <span className="text-xs text-danger">
                  این فیلد الزامی است.
                </span>
              )}
              {check && password && password?.length < 6 && (
                <span className="text-xs text-danger">
                  رمز عبور باید حداقل 6 رقم باشد
                </span>
              )}
            </div>
            <div className="relative w-full">
              <input
                className="border border-secondary/50 disabled:bg-secondary/10 disabled:cursor-not-allowed bg-white !p-1.5 rounded-md w-full text-sm placeholder:text-sm outline-none"
                type={type}
                name={"password"}
                onChange={(e) => setPassword(e?.target?.value)}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                value={password}
              />
              {password && (
                <button
                  type="button"
                  onClick={() =>
                    setType(type === "password" ? "text" : "password")
                  }
                  className="absolute top-1/2 -translate-y-1/2 left-2 text-lg cursor-pointer"
                >
                  {type === "password" ? (
                    <PiEyeDuotone />
                  ) : (
                    <PiEyeSlashDuotone />
                  )}
                </button>
              )}
            </div>
          </div>

          <button
            className={`bg-primary w-full text-white text-sm rounded-md !p-1.5 cursor-pointer disabled:bg-secondary/80 disabled:cursor-auto relative`}
            type="submit"
            disabled={loadingLogin}
          >
            <span>ورود</span>
            {loadingLogin && (
              <div className="absolute top-1/2 -translate-y-1/2 left-5 animate-spin text-base">
                <PiCircleNotch />
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MainLogin;
