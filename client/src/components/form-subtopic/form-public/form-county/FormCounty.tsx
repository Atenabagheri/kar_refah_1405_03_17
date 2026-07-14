import { useEffect, useState } from "react";
import InputForm from "../../../../ui/InputForm";
import SubmitButton from "../../../../ui/SubmitButton";
import type {
  FormCountyType,
  SelectFormDataType,
} from "../../../../types/types";
import SelectForm from "../../../../ui/SelectForm";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { fetchProvinces } from "../../../../redux/slices/subtopics/province/provinceSlice";
import {
  addCounty,
  editCounty,
} from "../../../../redux/slices/subtopics/county/countySlice";

const FormCounty = ({ data }: FormCountyType) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.county);
  const province = useAppSelector((state) => state.province);
  const [check, setCheck] = useState<boolean>(false);
  const isEdit: boolean = data?.name ? true : false;
  const [name, setName] = useState<string>(data?.name || "");
  const [faName, setFaName] = useState<string>(data?.faName || "");
  const [selectedProvince, setSelectedProvince] = useState<
    SelectFormDataType | undefined
  >(data?.provinceName || undefined);
  const [selectedProvinceName, setSelectedProvinceName] = useState<
    string | null
  >(data?.provinceName?.name || null);
  const [isCity, setIsCity] = useState<boolean>(data?.city || false);
  const [isNewCounty, setIsNewCounty] = useState<boolean>(
    data?.isNewCounty || false
  );

  useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !faName || !selectedProvinceName) {
      setCheck(true);
      return;
    }
    setCheck(false);
    const formData = {
      name,
      faName,
      provinceName: selectedProvinceName,
      city: isCity,
      isNewCounty,
    };
    const res = isEdit
      ? await dispatch(editCounty(formData))
      : await dispatch(addCounty(formData));
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
        <span>{isEdit ? "ویرایش" : "ایجاد"}</span> فرم شهرستان
      </h3>
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-[500px] !space-y-5 !p-3 bg-light border border-secondary/50 rounded-md"
      >
        <SelectForm
          label={"استان"}
          data={province?.provinceList}
          selected={selectedProvince}
          setSelected={setSelectedProvince}
          setSelectedName={setSelectedProvinceName}
          check={check}
          isLoading={province?.loading === "loadingList"}
          disabled={isEdit}
        />
        <InputForm
          name="name"
          title="نام انگلیسی"
          onChange={(e) => setName(e.target.value)}
          type={"text"}
          check={check}
          placeholder="نام انگلیسی"
          value={name}
          disabled={isEdit}
        />
        <InputForm
          name="faName"
          title="نام فارسی"
          onChange={(e) => setFaName(e.target.value)}
          type={"text"}
          check={check}
          placeholder="نام فارسی"
          value={faName}
        />
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <input
              onChange={() => {
                setIsCity(!isCity);
                setIsNewCounty(false);
              }}
              className="cursor-pointer"
              type="checkbox"
              id="city"
              name="city"
              checked={isCity}
            />
            <label
              className="cursor-pointer text-sm text-dark pt-0.5"
              htmlFor="city"
            >
              شهر دارد
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              onChange={() => {
                setIsNewCounty(!isNewCounty);
                setIsCity(false);
              }}
              className="cursor-pointer"
              type="checkbox"
              id="isNewCounty"
              name="isNewCounty"
              checked={isNewCounty}
            />
            <label
              className="cursor-pointer text-sm text-dark pt-0.5"
              htmlFor="isNewCounty"
            >
              شهرستان جدید
            </label>
          </div>
        </div>
        <SubmitButton
          isLoading={loading === "loadingAdd" || loading === "loadingEdit"}
          // disabled={province?.loading === "loadingList"}
          isEdit={isEdit}
        />
      </form>
    </div>
  );
};

export default FormCounty;
