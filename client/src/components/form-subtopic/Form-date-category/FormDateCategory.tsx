import React, { useState } from "react";
import SubmitButton from "../../../ui/SubmitButton";
import TextAreaForm from "../../../ui/TextAreaForm";
import InputForm from "../../../ui/InputForm";
import type { FormDateCategoryType } from "../../../types/types";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  addDateCategory,
  editDateCategory,
} from "../../../redux/slices/subtopics/date-category/dateCategorySlice";
import toast from "react-hot-toast";
import MainUploadExcel from "../../upload-excel/MainUploadExcel";

const FormDateCategory = ({ data }: FormDateCategoryType) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.dateCategory);
  const isEdit: boolean = data?.code ? true : false;
  const [check, setCheck] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(data?.title || "");
  const [code, setCode] = useState<string>(data?.code || "");
  const [description, setDescription] = useState<string>(
    data?.description || ""
  );
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !code) {
      setCheck(true);
      return;
    }
    setCheck(false);
    const formData = {
      title,
      code,
      description,
    };
    const res = isEdit
      ? await dispatch(editDateCategory(formData))
      : await dispatch(addDateCategory(formData));
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
      <div className="flex items-center gap-2 w-full">
        <h3 className="font-bold">ایجاد فرم تاریخ</h3>
        <MainUploadExcel url="/api/date-category/upload" />
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-[500px] !space-y-5 !p-3 bg-light border border-secondary/50 rounded-md"
      >
        <InputForm
          name="title"
          title="نام"
          onChange={(e) => setTitle(e.target.value)}
          type={"text"}
          check={check}
          placeholder="مرداد 1404"
          value={title}
        />

        <InputForm
          name="code"
          title="کد"
          onChange={(e) => setCode(e.target.value)}
          type={"number"}
          min={0}
          check={check}
          placeholder="140405"
          value={code}
          disabled={isEdit}
        />

        <TextAreaForm
          name="description"
          title="توضیحات"
          onChange={(e) => setDescription(e.target.value)}
          placeholder="توضیحات"
          value={description}
        />

        <SubmitButton
          isLoading={loading === "loadingAdd" || loading === "loadingEdit"}
          isEdit={isEdit}
        />
      </form>
    </div>
  );
};

export default FormDateCategory;
