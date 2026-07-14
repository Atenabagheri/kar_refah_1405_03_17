import { useRef, useState } from "react";
import InputForm from "../../../../ui/InputForm";
import SubmitButton from "../../../../ui/SubmitButton";
import TextAreaForm from "../../../../ui/TextAreaForm";
import api from "../../../../../api/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { type ImageListType } from "react-images-uploading";
import GalleryUpload from "../../GalleryUpload";
import DatePickerComponent from "../../../../ui/DatePickerComponent";
import SelectBySearchVehicle from "./SelectBySearchVehicle";
import type { VehicleType } from "../../../../types/types";

export interface ChildRef {
  triggerFunction: () => void;
}

const FormInsurance = () => {
  const selectRef: React.RefObject<ChildRef | null> = useRef(null);
  const thirdPartyRef: React.RefObject<ChildRef | null> = useRef(null);
  const inspectationRef: React.RefObject<ChildRef | null> = useRef(null);
  const bodyRef: React.RefObject<ChildRef | null> = useRef(null);
  const [check, setCheck] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [selectVehicle, setSelectVehicle] = useState<VehicleType | null>(null);

  // کد یکتای بیمه‌نامه
  const [insuranceCode, setInsuranceCode] = useState<string>("");
  // شماره بیمه شخص ثالث
  const [thirdPartyNumber, setThirdPartyNumber] = useState<string>("");
  // تاریخ اعتبار بیمه شخص ثالث
  const [thirdPartyExpire, setThirdPartyExpire] = useState<string | null>(null);
  // شماره بیمه بدنه
  const [bodyNumber, setBodyNumber] = useState<string>("");
  // تاریخ اعتبار بیمه بدنه
  const [bodyExpire, setBodyExpire] = useState<string | null>(null);
  // سریال گواهی معاینه فنی
  const [inspectionSerial, setInspectionSerial] = useState<string>("");
  // تاریخ اعتبار گواهی معاینه فنی
  const [inspectionExpire, setInspectionExpire] = useState<string | null>(null);

  const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<ImageListType>([]);
  const [image, setImage] = useState<ImageListType>([]);

  const formHandler = async () => {
    // e.preventDefault();
    if (
      !insuranceCode ||
      insuranceCode?.length < 2 ||
      !inspectionSerial ||
      !inspectionExpire ||
      !thirdPartyNumber ||
      !thirdPartyExpire ||
      !bodyNumber ||
      !bodyExpire ||
      !selectVehicle
    ) {
      setCheck(true);
      return;
    }

    setCheck(false);
    setLoading(true);

    const formData = new FormData();

    formData.append("insuranceCode", insuranceCode as string);

    formData.append("thirdPartyNumber", thirdPartyNumber as string);
    formData.append("thirdPartyExpire", thirdPartyExpire as string);

    formData.append("bodyNumber", bodyNumber as string);
    formData.append("bodyExpire", bodyExpire as string);

    formData.append("inspectionSerial", inspectionSerial as string);
    formData.append("inspectionExpire", inspectionExpire as string);

    formData.append("vehicle", selectVehicle?.vin as string);

    formData.append("description", description as string);

    formData.append("image", image[0]?.file as string | Blob);
    images.forEach((image) => {
      formData.append("gallery", image.file as string | Blob);
    });
    try {
      const res = await api.post(`/api/insurance/add-insurance`, formData, {
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
    setInsuranceCode("");

    setThirdPartyNumber("");
    setThirdPartyExpire(null);

    setBodyNumber("");
    setBodyExpire(null);

    setInspectionSerial("");
    setInspectionExpire(null);

    setDescription("");

    setSelectVehicle(null);
    selectRef?.current?.triggerFunction();
    inspectationRef?.current?.triggerFunction();
    bodyRef?.current?.triggerFunction();
    thirdPartyRef?.current?.triggerFunction();

    setImage([]);
    setImages([]);
  };

  return (
    <div
      // onSubmit={formHandler}
      className="w-full md:w-[90%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%] !space-y-5 !p-3 bg-light border border-secondary/50 rounded-md"
    >
      <div className="flex items-center gap-2 justify-between">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between">
            <label className="text-sm text-dark">انتخاب خودرو:</label>
            {check && !selectVehicle && (
              <p className="text-xs text-danger">این فیلد الزامی است</p>
            )}
          </div>
          <SelectBySearchVehicle
            selectVehicle={selectVehicle}
            setSelectVehicle={setSelectVehicle}
            ref={selectRef}
          />
        </div>

        <InputForm
          name="insuranceCode"
          title="کد یکتا بیمه‌نامه"
          onChange={(e) => setInsuranceCode(e.target.value)}
          type={"text"}
          check={check}
          placeholder="کد یکتا بیمه‌نامه"
          value={insuranceCode}
        />
      </div>
      <div className="flex items-center gap-2 justify-between">
        <InputForm
          name="thirdPartyNumber"
          title="شماره بیمه شخص ثالث"
          onChange={(e) => setThirdPartyNumber(e.target.value)}
          type={"text"}
          check={check}
          placeholder="شماره بیمه شخص ثالث"
          value={thirdPartyNumber}
        />
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between">
            <label className="text-sm text-dark">
              تاریخ اعتبار بیمه شخص ثالث :
            </label>
            {check && !thirdPartyExpire && (
              <p className="text-xs text-danger">این فیلد الزامی است</p>
            )}
          </div>
          <DatePickerComponent
            setDate={setThirdPartyExpire}
            dateRef={thirdPartyRef}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 justify-between">
        <InputForm
          name="bodyNumber"
          title="شماره بیمه بدنه"
          onChange={(e) => setBodyNumber(e.target.value)}
          type={"text"}
          check={check}
          placeholder="شماره بیمه بدنه"
          value={bodyNumber}
        />
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between">
            <label className="text-sm text-dark">
              تاریخ اعتبار بیمه بدنه :
            </label>
            {check && !bodyExpire && (
              <p className="text-xs text-danger">این فیلد الزامی است</p>
            )}
          </div>
          <DatePickerComponent setDate={setBodyExpire} dateRef={bodyRef} />
        </div>
      </div>
      <div className="flex items-center gap-2 justify-between">
        <InputForm
          name="inspectionSerial"
          title="سریال گواهی معاینه فنی"
          onChange={(e) => setInspectionSerial(e.target.value)}
          type={"text"}
          check={check}
          placeholder="سریال گواهی معاینه فنی"
          value={inspectionSerial}
        />
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between">
            <label className="text-sm text-dark">
              تاریخ اعتبار گواهی معاینه فنی :
            </label>
            {check && !inspectionExpire && (
              <p className="text-xs text-danger">این فیلد الزامی است</p>
            )}
          </div>
          <DatePickerComponent
            setDate={setInspectionExpire}
            dateRef={inspectationRef}
          />
        </div>
      </div>

      <TextAreaForm
        name="description"
        title="توضیحات"
        onChange={(e) => setDescription(e.target.value)}
        placeholder="توضیحات"
        value={description}
      />

      {/* <ImageUpload image={image} setImage={setImage} /> */}
      <GalleryUpload images={images} setImages={setImages} />
      <SubmitButton isLoading={loading} onClick={formHandler} type="button" />
    </div>
  );
};

export default FormInsurance;
