import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import type { FormCityType, SelectFormDataType } from "../../../../types/types";
import { fetchProvinces } from "../../../../redux/slices/subtopics/province/provinceSlice";
import { fetchCountyIncludeCity } from "../../../../redux/slices/subtopics/county/countySlice";
import SubmitButton from "../../../../ui/SubmitButton";
import SelectForm from "../../../../ui/SelectForm";
import InputForm from "../../../../ui/InputForm";
import toast from "react-hot-toast";
import {
  addCity,
  editCity,
} from "../../../../redux/slices/subtopics/city/citySlice";

const FormCity = ({ data }: FormCityType) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.city);
  const province = useAppSelector((state) => state.province);
  const [check, setCheck] = useState<boolean>(false);
  const county = useAppSelector((state) => state.county);
  const isEdit: boolean = data?.name ? true : false;
  const [name, setName] = useState<string>(data?.name || "");
  const [faName, setFaName] = useState<string>(data?.faName || "");

  const [selectedProvince, setSelectedProvince] = useState<
    SelectFormDataType | undefined
  >(data?.provinceName || undefined);
  const [selectedProvinceName, setSelectedProvinceName] = useState<
    string | null
  >(data?.provinceName?.name || null);

  const [selectedCounty, setSelectedCounty] = useState<
    SelectFormDataType | undefined
  >(data?.countyName || undefined);
  const [selectedCountyName, setSelectedCountyName] = useState<string | null>(
    data?.countyName?.name || null
  );

  useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedProvinceName) return;
    dispatch(fetchCountyIncludeCity(selectedProvinceName));
  }, [dispatch, selectedProvinceName]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !faName || !selectedProvinceName || !selectedCountyName) {
      setCheck(true);
      return;
    }
    setCheck(false);
    const formData = {
      name,
      faName,
      provinceName: selectedProvinceName,
      countyName: selectedCountyName,
    };
    const res = isEdit
      ? await dispatch(editCity(formData))
      : await dispatch(addCity(formData));
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
        <span>{isEdit ? "ویرایش" : "ایجاد"}</span> فرم شهر
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
        <SelectForm
          label={"شهرستان (قابلیت ایجاد شهر دارند)"}
          data={county?.countiesWithCity}
          selected={selectedCounty}
          setSelected={setSelectedCounty}
          setSelectedName={setSelectedCountyName}
          check={check}
          isLoading={county?.loading === "loadingByProvince"}
          disabled={isEdit ? true : selectedProvinceName ? false : true}
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
        <SubmitButton
          isLoading={loading === "loadingAdd" || loading === "loadingEdit"}
          // disabled={province?.loading === "loadingList"}
          isEdit={isEdit}
        />
      </form>
    </div>
  );
};

export default FormCity;
