import { useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import InputForm from "../../../ui/InputForm";
import TextAreaForm from "../../../ui/TextAreaForm";
import SubmitButton from "../../../ui/SubmitButton";
import api from "../../../../api/axios";

export interface ChildRef {
  triggerFunction: () => void;
}
const FormPosition = () => {
  const [check, setCheck] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const formHandler = async () => {
    // e.preventDefault();
    if (!title || title?.length < 2) {
      setCheck(true);
      return;
    }
    setCheck(false);
    setLoading(true);

    // const formData = new FormData();

    // formData.append("title", title as string);
    // formData.append("description", description as string);
    // formData.append("code", code as string);

    const formData = {
      title,
      code,
      description,
    };
    console.log(formData);
    try {
      const res = await api.post(`/api/position/add-position`, formData);
      console.log(formData);
      // console.log(res?.data);;
      toast.success(res.data.message);
      await clearHandler();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.log(error);
      toast.error(err.response?.data?.message as string);
    } finally {
      setLoading(false);
    }
  };

  const clearHandler = () => {
    setTitle("");
    setCode("");
    setDescription("");
  };

  return (
    <div
      // onSubmit={formHandler}
      className="w-full md:w-[90%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%] !space-y-5 !p-3 bg-light border border-secondary/50 rounded-md"
    >
      <div className="flex gap-2 w-full">
        <InputForm
          name="title"
          title="عنوان سمت"
          onChange={(e) => setTitle(e.target.value)}
          type={"text"}
          check={check}
          placeholder="عنوان سمت"
          value={title}
        />
        <InputForm
          name="code"
          title="کد سمت"
          onChange={(e) => setCode(e.target.value)}
          type={"text"}
          check={check}
          placeholder="کد سمت"
          value={code}
        />
      </div>

      <TextAreaForm
        name="description"
        title="توضیحات"
        onChange={(e) => setDescription(e.target.value)}
        placeholder="توضیحات"
        value={description}
      />

      <SubmitButton isLoading={loading} onClick={formHandler} type="button" />
    </div>
  );
};

export default FormPosition;
