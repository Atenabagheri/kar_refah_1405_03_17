import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { type ImageListType } from "react-images-uploading";
import type {
  BuildingType,
  OptionsType,
  SelectFormDataType,
} from "../../../../types/types";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { fetchProvinces } from "../../../../redux/slices/dashboard/provinceSlice";
import { fetchCountyWithProvince } from "../../../../redux/slices/subtopics/county/countySlice";
import { fetchCityWithCounty } from "../../../../redux/slices/subtopics/city/citySlice";
import InputForm from "../../../../ui/InputForm";
import SelectForm from "../../../../ui/SelectForm";
import TextAreaForm from "../../../../ui/TextAreaForm";
import ImageUpload from "../../ImageUpload";
import GalleryUpload from "../../GalleryUpload";
import SubmitButton from "../../../../ui/SubmitButton";
import api from "../../../../../api/axios";
import StaticSelectForm from "../../../../ui/StaticSelectForm";
import DatePickerComponent from "../../../../ui/DatePickerComponent";
import SelectBySearchBuilding from "../../SelectBySearchBuilding";

export interface ChildRef {
  triggerFunction: () => void;
}

const FormDiesel = () => {
  // نوع ستادی/استانی
  const typeList: OptionsType[] = [
    { value: "hqs", name: "ستادی" },
    { value: "province", name: "استانی" },
  ];

  const dispatch = useAppDispatch();

  const selectRef: React.RefObject<ChildRef | null> = useRef(null);
  const purchaseDateRef: React.RefObject<ChildRef | null> = useRef(null);
  const [check, setCheck] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [amount, setAmount] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");

  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [documentNumber, setDocumentNumber] = useState<string>("");

  const [purchaseDate, setPurchaseDate] = useState<string | null>(null);

  const [type, setType] = useState<"province" | "hqs" | "">("");
  const [selectBuilding, setSelectBuilding] = useState<BuildingType | null>(
    null,
  );

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
    if (!selectedProvince) return;
    dispatch(fetchCountyWithProvince(selectedProvince.name));
  }, [dispatch, selectedProvince]);

  useEffect(() => {
    if (!selectedCounty) return;
    dispatch(fetchCityWithCounty(selectedCounty.name));
  }, [dispatch, selectedCounty]);

  const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<ImageListType>([]);
  const [image, setImage] = useState<ImageListType>([]);

  const formHandler = async () => {
    // e.preventDefault();
    if (
      !invoiceNumber ||
      invoiceNumber?.length < 2 ||
      !documentNumber ||
      documentNumber?.length < 2 ||
      !selectBuilding
    ) {
      setCheck(true);
      return;
    }
    setCheck(false);
    setLoading(true);

    const formData = new FormData();

    formData.append("province", selectedProvince?.name as string);
    formData.append("county", selectedCounty?.name as string);

    formData.append("building", selectBuilding?.postalCode as string);
    formData.append("invoiceNumber", invoiceNumber as string);
    formData.append("documentNumber", documentNumber as string);
    formData.append("purchaseDate", purchaseDate as string);
    formData.append("amount", amount as string);
    formData.append("quantity", quantity as string);
    formData.append("description", description as string);
    formData.append("type", type as string);
    formData.append("image", image[0]?.file as string | Blob);
    images.forEach((image) => {
      formData.append("gallery", image.file as string | Blob);
    });
    try {
      const res = await api.post(`/api/diesel/add-diesel`, formData, {
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
    setAmount("");
    setQuantity("");
    setInvoiceNumber("");
    setDocumentNumber("");
    setPurchaseDate(null);

    setSelectedProvince(undefined);
    setSelectedCounty(undefined);

    setType("");
    setDescription("");
    setImage([]);
    setImages([]);
    setSelectBuilding(null);
    selectRef?.current?.triggerFunction();
    purchaseDateRef?.current?.triggerFunction();
  };

  return (
    <div
      // onSubmit={formHandler}
      className="w-full md:w-[90%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%] !space-y-5 !p-3 bg-light border border-secondary/50 rounded-md"
    >
      <div className="flex items-center gap-2 w-full">
        <InputForm
          name="invoiceNumber"
          title="شماره فاکتور"
          onChange={(e) => setInvoiceNumber(e.target.value)}
          type={"text"}
          check={check}
          placeholder="شماره فاکتور"
          value={invoiceNumber}
        />
        <InputForm
          name="documentNumber"
          title="شماره نیاز"
          onChange={(e) => setDocumentNumber(e.target.value)}
          type={"text"}
          check={check}
          placeholder="شماره نیاز"
          value={documentNumber}
        />
      </div>
      <div className="flex items-center gap-2 w-full">
        <InputForm
          name="amount"
          title="مبلغ خرید"
          onChange={(e) => setAmount(e.target.value)}
          type={"text"}
          check={check}
          placeholder="مبلغ خرید"
          value={amount}
        />
        <InputForm
          name="quantity"
          title="میزان خرید"
          onChange={(e) => setQuantity(e.target.value)}
          type={"text"}
          check={check}
          placeholder="میزان خرید"
          value={quantity}
        />
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between">
            <label className="text-sm text-dark">تاریخ خرید</label>
            {check && !purchaseDate && (
              <p className="text-xs text-danger">این فیلد الزامی است</p>
            )}
          </div>
          <DatePickerComponent
            setDate={setPurchaseDate}
            dateRef={purchaseDateRef}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 justify-between">
        <StaticSelectForm
          title={"استانی/ستادی"}
          name={"type"}
          options={typeList}
          onChange={(e) => setType(e.target.value as "province" | "hqs" | "")}
          check={check}
          value={type}
        />
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
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-dark">انتخاب ساختمان:</label>
          {check && !selectBuilding && (
            <p className="text-xs text-danger">این فیلد الزامی است</p>
          )}
        </div>
        <SelectBySearchBuilding
          county={selectedCounty?.name}
          selectBuilding={selectBuilding}
          setSelectBuilding={setSelectBuilding}
          ref={selectRef}
          disabled={selectedCounty ? false : true}
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

export default FormDiesel;
