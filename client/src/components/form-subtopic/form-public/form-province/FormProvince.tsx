import { useState } from "react";
import InputForm from "../../../../ui/InputForm";
import SubmitButton from "../../../../ui/SubmitButton";
import toast from "react-hot-toast";
import type { FormProvinceType, ProvinceType } from "../../../../types/types";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  addProvince,
  editProvince,
} from "../../../../redux/slices/subtopics/province/provinceSlice";

const FormProvince = ({ data }: FormProvinceType) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.province);
  const { token } = useAppSelector((state) => state.auth);
  const [check, setCheck] = useState<boolean>(false);
  const isEdit: boolean = data?.name ? true : false;
  const [name, setName] = useState<string>(data?.name || "");
  const [faName, setFaName] = useState<string>(data?.faName || "");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    if (!name || !faName) {
      setCheck(true);
      return;
    }
    setCheck(false);
    const formData:ProvinceType = {
      name,
      faName,
    };
    const res = isEdit
      ? await dispatch(editProvince(formData))
      : await dispatch(addProvince(formData));
    if ("meta" in res) {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success((res.payload as { message: string })?.message);
      } else {
        toast.error(res.payload as string);
      }
    }
    console.log(res);
  };
  return (
    <div className="!p-4 !px-4 md:!px-10 flex flex-col gap-4">
      <h3 className="font-bold">
        <span>{isEdit ? "ویرایش" : "ایجاد"}</span> فرم استان
      </h3>
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-[500px] !space-y-5 !p-3 bg-light border border-secondary/50 rounded-md"
      >
        <InputForm
          name="name"
          title="نام انگلیسی"
          onChange={(e) => setName(e.target.value)}
          type={"text"}
          check={check}
          placeholder="eastAzerbaijan"
          value={name}
          disabled={isEdit}
        />
        <InputForm
          name="faName"
          title="نام فارسی"
          onChange={(e) => setFaName(e.target.value)}
          type={"text"}
          check={check}
          placeholder="آذربایجان شرقی"
          value={faName}
        />
        <SubmitButton
          isLoading={loading === "loadingAdd" || loading === "loadingEdit"}
          isEdit={isEdit}
        />
      </form>
    </div>
  );
};

export default FormProvince;
