import { useEffect, useState } from "react";
import InputForm from "../../../ui/InputForm";
import TextAreaForm from "../../../ui/TextAreaForm";
import SubmitButton from "../../../ui/SubmitButton";
import type {
  DateCategoryType,
  FormUnitPostType,
  OptionsType,
  SelectFormDataType,
} from "../../../types/types";
import SelectForm from "../../../ui/SelectForm";
import StaticSelectForm from "../../../ui/StaticSelectForm";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchProvinces } from "../../../redux/slices/subtopics/province/provinceSlice";
import { fetchCountyWithProvince } from "../../../redux/slices/subtopics/county/countySlice";
import { fetchCityWithCounty } from "../../../redux/slices/subtopics/city/citySlice";
import {
  addUnitPost,
  editUnitPost,
} from "../../../redux/slices/subtopics/unitPost/unitPostSlice";
import DateCategorySelect from "./DateCategorySelect";
import { fetchDateCategories } from "../../../redux/slices/subtopics/date-category/dateCategorySlice";

const FormUnitPost = ({ data }: FormUnitPostType) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.unitPost);
  const city = useAppSelector((state) => state.city);
  const province = useAppSelector((state) => state.province);
  const county = useAppSelector((state) => state.county);
  const dateCategory = useAppSelector((state) => state.dateCategory);
  const [check, setCheck] = useState<boolean>(false);
  const isEdit: boolean = data?._id ? true : false;
  const [withTenure, setWithTenure] = useState<number | string>(
    data?.WithTenure || ""
  );
  const [withoutTenure, setWithoutTenure] = useState<number | string>(
    data?.WithoutTenure || ""
  );
  const [officeComplex, setOfficeComplex] = useState<boolean>(
    data?.officeComplex || false
  );
  const [isUpdate, setIsUpdate] = useState<boolean>(data?.isUpdate || false);
  const [population, setPopulation] = useState<number | string>(
    data?.population || ""
  );
  const [distance, setDistance] = useState<number | string>(
    data?.distance || ""
  );
  // توضیحات
  const [description, setDescription] = useState<string>(
    data?.description || ""
  );
  // توضیحات پروفایل
  const [updateDescription, setUpdateDescription] = useState<string>(
    data?.updateDescription || ""
  );
  // استان
  const [selectedProvince, setSelectedProvince] = useState<
    SelectFormDataType | undefined
  >(data?.provinceName || undefined);
  const [selectedProvinceName, setSelectedProvinceName] = useState<
    string | null
  >(data?.provinceName?.name || null);
  // شهرستان
  const [selectedCounty, setSelectedCounty] = useState<
    SelectFormDataType | undefined
  >(data?.countyName || undefined);
  const [selectedCountyName, setSelectedCountyName] = useState<string | null>(
    data?.countyName?.name || null
  );
  // شهر
  const [selectedCity, setSelectedCity] = useState<
    SelectFormDataType | undefined
  >(data?.cityName || undefined);
  const [selectedCityName, setSelectedCityName] = useState<string | null>(
    data?.cityName?.name || null
  );
  // تاریخ
  const [selectedDate, setSelectedDate] = useState<
    DateCategoryType | undefined
  >(data?.dateCategory || undefined);
  const [selectedDateCode, setSelectedDateCode] = useState<string | null>(
    data?.dateCategory?.code || null
  );

  // واحد اداری مصوب
  const unitTypeList: OptionsType[] = [
    { value: "Management", name: "مدیریت/مرکز" },
    { value: "Department", name: "اداره" },
    { value: "Agency", name: "نمایندگی" },
  ];
  const prevUnitType = data?.countyName?.isNewCounty
    ? "WithoutDepartment"
    : data?.unitType;
  const [selectedUnitType, setSelectedUnitType] = useState<string>(
    prevUnitType || ""
  );

  useEffect(() => {
    dispatch(fetchDateCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedProvinceName) return;
    dispatch(fetchCountyWithProvince(selectedProvinceName));
  }, [dispatch, selectedProvinceName]);

  useEffect(() => {
    if (!selectedCountyName) return;
    dispatch(fetchCityWithCounty(selectedCountyName));
  }, [dispatch, selectedCountyName]);

  useEffect(() => {
    if (!isEdit) {
      setSelectedCounty(undefined);
      setSelectedCountyName(null);
      setSelectedCity(undefined);
      setSelectedCityName(null);
    }
  }, [selectedProvince, isEdit]);

  useEffect(() => {
    if (!isEdit) {
      setSelectedCity(undefined);
      setSelectedCityName(null);
    }
  }, [selectedCounty, isEdit]);

  useEffect(() => {
    if (!isEdit && selectedCounty?.name && selectedCounty?.isNewCounty) {
      setSelectedUnitType("");
      setWithTenure("");
      setWithoutTenure("");
    }
  }, [isEdit, selectedCounty]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isNewCountyCondition =
      selectedCountyName && selectedCounty?.isNewCounty;

    const isMissingRequired = isNewCountyCondition
      ? !selectedProvinceName ||
        !selectedCountyName ||
        !population ||
        !distance ||
        !selectedDateCode
      : !selectedProvinceName ||
        !selectedCountyName ||
        !selectedUnitType ||
        !withTenure ||
        !withoutTenure ||
        !population ||
        !distance ||
        !selectedDateCode;

    const isCityRequiredButMissing = selectedCounty?.city && !selectedCity;

    if (isMissingRequired || isCityRequiredButMissing) {
      setCheck(true);
      return;
    }
    setCheck(false);
    const formData = {
      creator:'0014485109',
      provinceName: selectedProvinceName,
      countyName: selectedCountyName,
      cityName: selectedCityName,
      unitType: selectedUnitType || "WithoutDepartment",
      WithTenure: withTenure || 0,
      WithoutTenure: withoutTenure || 0,
      population,
      dateCategory: selectedDateCode,
      distance,
      officeComplex,
      description,
      isUpdate,
      updateDescription,
    };
    const url = data?.cityName
      ? `/api/unit-position/edit-unit-position-with-city/${data?.cityName?.name}`
      : `/api/unit-position/edit-unit-position-with-county/${data?.countyName?.name}`;
    console.log(url);
    const res = isEdit
      ? await dispatch(editUnitPost({ formData, url }))
      : await dispatch(addUnitPost(formData));
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
        <span>{isEdit ? "ویرایش" : "ایجاد"}</span> فرم unit position
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
          label={"شهرستان"}
          data={county?.countyByProvince}
          selected={selectedCounty}
          setSelected={setSelectedCounty}
          setSelectedName={setSelectedCountyName}
          check={check}
          isLoading={county?.loading === "loadingByProvince"}
          disabled={isEdit ? true : selectedProvinceName ? false : true}
        />

        <SelectForm
          label={"شهر"}
          data={city?.cityByCounty}
          selected={selectedCity}
          setSelected={setSelectedCity}
          setSelectedName={setSelectedCityName}
          check={check && selectedCounty?.city}
          isLoading={city?.loading === "loadingByCounty"}
          disabled={isEdit ? true : selectedCounty?.city ? false : true}
        />

        <DateCategorySelect
          label={"تاریخ"}
          data={dateCategory?.dateCategoryList}
          selected={selectedDate}
          setSelected={setSelectedDate}
          setSelectedCode={setSelectedDateCode}
          check={check}
          isLoading={dateCategory?.loading === "loadingByCounty"}
        />

        <StaticSelectForm
          title={"واحد اداری مصوب "}
          name={"unitType"}
          options={unitTypeList}
          onChange={(e) => setSelectedUnitType(e.target.value)}
          check={
            selectedCounty
              ? !selectedCounty?.isNewCounty && check
              : !selectedCounty && check
                ? true
                : false
          }
          value={selectedUnitType}
          disabled={selectedCounty?.isNewCounty}
        />

        <InputForm
          name="withTenure"
          title="با تصدی"
          onChange={(e) => setWithTenure(e.target.value)}
          type={"number"}
          min={0}
          check={
            selectedCounty
              ? !selectedCounty?.isNewCounty && check
              : !selectedCounty && check
                ? true
                : false
          }
          placeholder="با تصدی"
          value={withTenure}
          disabled={selectedCounty?.isNewCounty}
        />

        <InputForm
          name="withoutTenure"
          title="بدون تصدی"
          onChange={(e) => setWithoutTenure(e.target.value)}
          type={"number"}
          min={0}
          check={
            selectedCounty
              ? !selectedCounty?.isNewCounty && check
              : !selectedCounty && check
                ? true
                : false
          }
          placeholder="بدون تصدی"
          value={withoutTenure}
          disabled={selectedCounty?.isNewCounty}
        />

        <div className="flex items-center gap-3">
          <input
            onChange={() => setOfficeComplex(!officeComplex)}
            className="cursor-pointer"
            type="checkbox"
            id="official"
            name="official"
            defaultChecked={officeComplex}
          />
          <label
            className="cursor-pointer text-sm text-dark pt-0.5"
            htmlFor="official"
          >
            احداث مجتمع اداری
          </label>
        </div>

        <InputForm
          name="population"
          title="جمعیت(هزار نفر)"
          onChange={(e) => setPopulation(e.target.value)}
          type={"number"}
          min={0}
          check={check}
          placeholder="جمعیت"
          value={population}
        />

        <InputForm
          name="distance"
          title="فاصله تا نزدیکترین اداره"
          onChange={(e) => setDistance(e.target.value)}
          type={"number"}
          min={0}
          check={check}
          placeholder="فاصله تا نزدیکترین اداره"
          value={distance}
        />

        <InputForm
          name="description"
          title="توضیحات"
          onChange={(e) => setDescription(e.target.value)}
          type={"text"}
          // check={check}
          placeholder="توضیحات"
          value={description}
        />

        <div className="flex items-center gap-3">
          <input
            onChange={() => setIsUpdate(!isUpdate)}
            className="cursor-pointer"
            type="checkbox"
            id="update"
            name="update"
            defaultChecked={isUpdate}
          />
          <label
            className="cursor-pointer text-sm text-dark pt-0.5"
            htmlFor="update"
          >
            قابلیت ارتقاء دارد
          </label>
        </div>

        <TextAreaForm
          name="description"
          title="توضیحات پروفایل"
          onChange={(e) => setUpdateDescription(e.target.value)}
          // check={check}
          placeholder="توضیحات پروفایل"
          value={updateDescription}
        />

        <SubmitButton
          isLoading={loading === "loadingAdd" || loading === "loadingEdit"}
          isEdit={isEdit}
          // disabled={province?.loading === "loadingList"}
        />
      </form>
    </div>
  );
};

export default FormUnitPost;
