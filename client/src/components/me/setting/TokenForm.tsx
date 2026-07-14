import { useEffect, useState } from "react";
import SubmitButton from "../../../ui/SubmitButton";
import api from "../../../../api/axios";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import TextAreaForm from "../../../ui/TextAreaForm";
import { useAppSelector } from "../../../redux/hooks";

const TokenForm = () => {
  const { token } = useAppSelector((state) => state.auth);
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const settingHandler = async () => {
    if (!value || !token) return;
    setLoading(true);
    try {
      const res = await api.put(
        `/api/settings`,
        {
          key: "token",
          value,
          description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // console.log(res?.data);;
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message as string);
    } finally {
      setLoading(false);
    }
  };

  const getToken = async () => {
    try {
      const res = await api.get(`/api/settings/token`);
      // console.log(res?.data);;
      if (res.data.data) {
        setValue(res.data.data);
      }
      if (res.data.description) {
        setDescription(res.data.description);
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
  return (
    <div className="w-full md:w-[90%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%] !space-y-5 !p-3 bg-light border border-secondary/50 rounded-md">
      <div className="flex flex-col gap-4">
        <TextAreaForm
          name="value"
          placeholder="توکن را اینجا وارد کنید"
          title="توکن برق"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={!value.length ? "text-right" : "text-left ltr"}
        />
        <TextAreaForm
          name="description"
          placeholder="توضیحات را اینجا وارد کنید"
          title="توضیحات توکن برق"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <SubmitButton
          onClick={settingHandler}
          type="button"
          isLoading={loading}
          disabled={loading}
          className="!w-fit !px-10"
        />
      </div>
    </div>
  );
};

export default TokenForm;
