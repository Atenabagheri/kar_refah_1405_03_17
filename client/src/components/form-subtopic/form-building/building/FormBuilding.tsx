import { useEffect, useRef, useState } from "react";
import InputForm from "../../../../ui/InputForm";
import SubmitButton from "../../../../ui/SubmitButton";
import TextAreaForm from "../../../../ui/TextAreaForm";
import Select, { type SelectInstance, type ThemeConfig } from "react-select";
import {
  type OptionsType,
  type SelectFormDataType,
} from "../../../../types/types";
import SelectForm from "../../../../ui/SelectForm";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import StaticSelectForm from "../../../../ui/StaticSelectForm";
import { fetchProvinces } from "../../../../redux/slices/dashboard/provinceSlice";
import { fetchCountyWithProvince } from "../../../../redux/slices/subtopics/county/countySlice";
import { fetchCityWithCounty } from "../../../../redux/slices/subtopics/city/citySlice";
import api from "../../../../../api/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { type ImageListType } from "react-images-uploading";
import ImageUpload from "../../ImageUpload";
import GalleryUpload from "../../GalleryUpload";

interface IOption {
  value: string;
  label: string;
}
const FormBuilding = () => {
  const dispatch = useAppDispatch();
  const selectRef = useRef<SelectInstance<IOption> | null>(null);
  const province = useAppSelector((state) => state.province);
  const county = useAppSelector((state) => state.county);

  // استان
  const [selectedProvince, setSelectedProvince] = useState<
    SelectFormDataType | undefined
  >(undefined);
  // شهرستان
  const [selectedCounty, setSelectedCounty] = useState<
    SelectFormDataType | undefined
  >(undefined);

  useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedProvince?.name) return;
    dispatch(fetchCountyWithProvince(selectedProvince?.name));
  }, [dispatch, selectedProvince?.name]);

  useEffect(() => {
    if (!selectedCounty?.name) return;
    dispatch(fetchCityWithCounty(selectedCounty?.name));
  }, [dispatch, selectedCounty?.name]);

  const [check, setCheck] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [number, setNumber] = useState<string | number>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [meterage, setMeterage] = useState<string>("");
  const [landArea, setLandArea] = useState<string>("");
  const [builtArea, setBuiltArea] = useState<string>("");
  const [floorsCount, setFloorsCount] = useState<string | number>("");
  const [ownership, setOwnership] = useState<"other" | "owner" | "leased" | "">(
    "",
  );
  const [usage, setUsage] = useState<IOption[]>([]);
  const [type, setType] = useState<"province" | "hqs" | "">("");

  // نوع ستادی/استانی
  const typeList: OptionsType[] = [
    { value: "hqs", name: "ستادی" },
    { value: "province", name: "استانی" },
  ];

  // نوع ملک
  const ownershipList: OptionsType[] = [
    { value: "owner", name: "ملکی" },
    { value: "leased", name: "استیجاری" },
    { value: "other", name: "سایر" },
  ];

  // نوع کاربری
  const usageList = [
    { value: "administrative", label: "اداری" },
    { value: "educational", label: "آموزشی" },
    { value: "sports", label: "ورزشی" },
    { value: "welfare", label: "رفاهی" },
    { value: "cultural", label: "فرهنگی" },
    { value: "other", label: "سایر" },
  ];

  const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<ImageListType>([]);
  const [image, setImage] = useState<ImageListType>([]);

  const formHandler = async () => {
    // e.preventDefault();
    if (!name || name?.length < 2 || !postalCode || !address || !ownership) {
      setCheck(true);
      return;
    }
    if (postalCode.length !== 10) {
      setError("کد پستی باید 10 رقم باشد.");
      return;
    }
    setError("");
    setCheck(false);
    setLoading(true);

    const formData = new FormData();

    formData.append("province", selectedProvince?.name as string);
    formData.append("county", selectedCounty?.name as string);
    formData.append("postalCode", postalCode as string);
    formData.append("name", name as string);
    formData.append("description", description as string);
    formData.append("address", address as string);
    formData.append("number", number as string);
    formData.append("type", type as string);
    formData.append("ownership", ownership as string);
    formData.append("meterage", meterage as string);
    formData.append("floors", floorsCount as string);
    formData.append("landArea", landArea as string);
    formData.append("builtArea", builtArea as string);
    usage.forEach((u) => {
      formData.append("usage", u.value);
    });
    formData.append("image", image[0]?.file as string | Blob);
    images.forEach((image) => {
      formData.append("gallery", image.file as string | Blob);
    });
    try {
      const res = await api.post(`/api/building/add-building`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
    setName("");
    setNumber("");
    setPostalCode("");
    setAddress("");
    setMeterage("");
    setLandArea("");
    setBuiltArea("");
    setFloorsCount("");
    setOwnership("");
    setUsage([]);

    setType("");
    setDescription("");
    setImage([]);
    setImages([]);
    setSelectedProvince(undefined);
    setSelectedCounty(undefined);

    if (selectRef?.current) {
      selectRef?.current?.clearValue();
    }
  };

  return (
    <div
      // onSubmit={formHandler}
      className="w-full md:w-[90%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%] !space-y-5 !p-3 bg-light border border-secondary/50 rounded-md"
    >
      <InputForm
        name="name"
        title="عنوان ساختمان"
        onChange={(e) => setName(e.target.value)}
        type={"text"}
        check={check}
        placeholder="عنوان ساختمان"
        value={name}
      />
      <div className="flex items-center gap-2 justify-between">
        <SelectForm
          label={"استان"}
          data={province?.provinceList}
          selected={selectedProvince}
          setSelected={setSelectedProvince}
          check={check}
          isLoading={province?.loading === "loadingList"}
        />

        <SelectForm
          label={"شهرستان"}
          data={county?.countyByProvince}
          selected={selectedCounty}
          setSelected={setSelectedCounty}
          check={check}
          isLoading={county?.loading === "loadingByProvince"}
          disabled={selectedProvince ? false : true}
        />

        {/* <SelectForm
          label={"شهر"}
          data={city?.cityByCounty}
          selected={selectedCity}
          setSelected={setSelectedCity}
          setSelectedName={setSelectedCityName}
          check={check && selectedCounty?.city}
          isLoading={city?.loading === "loadingByCounty"}
          disabled={selectedCounty?.city ? false : true}
        /> */}
      </div>
      <div className="flex gap-2 w-full">
        <InputForm
          name="number"
          title="پلاک"
          onChange={(e) => setNumber(e.target.value)}
          type={"text"}
          check={check}
          placeholder="پلاک"
          value={number}
        />

        <InputForm
          name="postalCode"
          title="کد پستی"
          onChange={(e) => setPostalCode(e.target.value)}
          type={"text"}
          check={check}
          placeholder="کد پستی"
          value={postalCode}
          error={error}
        />
      </div>
      <InputForm
        name="address"
        title="آدرس"
        onChange={(e) => setAddress(e.target.value)}
        type={"text"}
        check={check}
        placeholder="آدرس"
        value={address}
      />
      <div className="flex gap-2 w-full">
        <StaticSelectForm
          title={"نوع ملکی"}
          name={"ownership"}
          options={ownershipList}
          onChange={(e) =>
            setOwnership(e.target.value as "other" | "owner" | "leased")
          }
          check={check}
          value={ownership}
        />
        <StaticSelectForm
          title={"استانی/ستادی"}
          name={"type"}
          options={typeList}
          onChange={(e) => setType(e.target.value as "province" | "hqs" | "")}
          check={check}
          value={type}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-dark">نوع کاربری:</label>
        <Select
          ref={selectRef}
          isMulti
          options={usageList}
          onChange={(s) => setUsage(s as { value: string; label: string }[])}
          placeholder="انتخاب کنید"
          isSearchable
          className="text-sm"
          theme={{ borderRadius: 6 } as ThemeConfig}
          backspaceRemovesValue={usage.length === 0}
        />
      </div>

      <div className="flex gap-2 w-full">
        <InputForm
          name="floorsCount"
          title="تعداد طبقه"
          onChange={(e) => setFloorsCount(e.target.value)}
          type={"text"}
          placeholder="تعداد طبقه"
          value={floorsCount}
        />
        <InputForm
          name="meterage"
          title="متراژ"
          onChange={(e) => setMeterage(e.target.value)}
          type={"text"}
          placeholder="متراژ"
          value={meterage}
        />
        <InputForm
          name="landArea"
          title="عرصه"
          onChange={(e) => setLandArea(e.target.value)}
          type={"text"}
          placeholder="عرصه"
          value={landArea}
        />
        <InputForm
          name="builtArea"
          title="عیان"
          onChange={(e) => setBuiltArea(e.target.value)}
          type={"text"}
          placeholder="عیان"
          value={builtArea}
        />
      </div>
      <TextAreaForm
        name="description"
        title="توضیحات"
        onChange={(e) => setDescription(e.target.value)}
        placeholder="توضیحات"
        value={description}
      />

      <ImageUpload image={image} setImage={setImage} />
      <GalleryUpload images={images} setImages={setImages} />
      <SubmitButton isLoading={loading} onClick={formHandler} type="button" />
    </div>
  );
};

export default FormBuilding;
