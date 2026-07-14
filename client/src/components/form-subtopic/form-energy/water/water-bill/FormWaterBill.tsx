import { useRef, useState } from "react";
import InputForm from "../../../../../ui/InputForm";
import SubmitButton from "../../../../../ui/SubmitButton";
import TextAreaForm from "../../../../../ui/TextAreaForm";
import api from "../../../../../../api/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { type ImageListType } from "react-images-uploading";
import ImageUpload from "../../../ImageUpload";
import GalleryUpload from "../../../GalleryUpload";
import type { WaterMetersType } from "../../../../../types/types";
import SelectBySearch from "./SelectBySearch";
import DatePickerComponent from "../../../../../ui/DatePickerComponent";

export interface ChildRef {
  triggerFunction: () => void;
}

const FormWaterBill = () => {
  const selectRef: React.RefObject<ChildRef | null> = useRef(null);
  const paymentDeadLineRef: React.RefObject<ChildRef | null> = useRef(null);
  const currentReadingRef: React.RefObject<ChildRef | null> = useRef(null);
  const previousReadingRef: React.RefObject<ChildRef | null> = useRef(null);

  const [check, setCheck] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // شناسه پراخت
  const [paymentIdentifier, setPaymentIdentifier] = useState<string>("");
  // مبلغ پرداخت
  const [totalBillDebt, setTotalBillDebt] = useState<string>("");
  // مصرف کل دوره
  const [totalPeriod, setTotalPeriod] = useState<string>("");
  // متوسط مصرف 30 روز
  const [averageThirtyDay, setAverageThirtyDay] = useState<string>("");
  // تعداد کل روزهای دوره
  const [totalDays, setTotalDays] = useState<string>("");
  // مهلت پرداخت
  const [paymentDeadLine, setPaymentDeadLine] = useState<string | null>(null);
  // قرائت کنونی
  const [currentReading, setCurrentReading] = useState<string | null>(null);
  // قرائت پیشین
  const [previousReading, setPreviousReading] = useState<string | null>(null);
  // دوره
  const [period, setPeriod] = useState<string>("");

  const [selectMeter, setSelectMeter] = useState<WaterMetersType | null>(null);
  const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<ImageListType>([]);
  const [image, setImage] = useState<ImageListType>([]);

  const formHandler = async () => {
    // e.preventDefault();
    if (
      !selectMeter ||
      !selectMeter?.billIdentifier ||
      !selectMeter?.serialNumber ||
      !paymentIdentifier ||
      !totalBillDebt ||
      !totalPeriod ||
      !averageThirtyDay ||
      !totalDays ||
      !paymentDeadLine ||
      !currentReading ||
      !previousReading
    ) {
      setCheck(true);
      return;
    }
    setCheck(false);
    setLoading(true);

    const formData = new FormData();

    formData.append("paymentIdentifier", paymentIdentifier as string);
    formData.append("serialNumber", selectMeter.serialNumber as string);
    formData.append("billIdentifier", selectMeter.billIdentifier as string);
    formData.append("totalBillDebt", totalBillDebt as string);
    formData.append("totalPeriod", totalPeriod as string);
    formData.append("averageThirtyDay", averageThirtyDay as string);
    formData.append("totalDays", totalDays as string);
    formData.append("paymentDeadLine", paymentDeadLine as string);
    formData.append("currentReading", currentReading as string);
    formData.append("previousReading", previousReading as string);
    formData.append("period", period as string);

    formData.append("description", description as string);

    formData.append("image", image[0]?.file as string | Blob);
    images.forEach((image) => {
      formData.append("gallery", image.file as string | Blob);
    });
    try {
      const res = await api.post(`/api/water-bill/add-water-bill`, formData, {
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
    setPaymentIdentifier("");
    setTotalBillDebt("");
    setTotalPeriod("");
    setAverageThirtyDay("");
    setTotalDays("");
    setPaymentDeadLine(null);
    setCurrentReading(null);
    setPreviousReading(null);
    setPeriod("");

    setDescription("");
    setImage([]);
    setImages([]);
    setSelectMeter(null);
    selectRef?.current?.triggerFunction();
    paymentDeadLineRef?.current?.triggerFunction();
    currentReadingRef?.current?.triggerFunction();
    previousReadingRef?.current?.triggerFunction();
  };

  return (
    <div
      // onSubmit={formHandler}
      className="w-full md:w-[90%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%] !space-y-5 !p-3 bg-light border border-secondary/50 rounded-md"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-dark">انتخاب کنتور:</label>
          {check && !selectMeter && (
            <p className="text-xs text-danger">این فیلد الزامی است</p>
          )}
        </div>
        <SelectBySearch
          selectMeter={selectMeter}
          setSelectMeter={setSelectMeter}
          ref={selectRef}
        />
      </div>

      <div className="flex items-center gap-2 w-full">
        <InputForm
          name="paymentIdentifier"
          title="شناسه پرداخت"
          onChange={(e) => setPaymentIdentifier(e.target.value)}
          type={"text"}
          check={check}
          placeholder="شناسه پرداخت"
          value={paymentIdentifier}
        />
        <InputForm
          name="totalBillDebt"
          title="مبلغ پرداخت"
          onChange={(e) => setTotalBillDebt(e.target.value)}
          type={"text"}
          check={check}
          placeholder="مبلغ پرداخت"
          value={totalBillDebt}
        />
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between">
            <label className="text-sm text-dark">مهلت پرداخت</label>
            {check && !paymentDeadLine && (
              <p className="text-xs text-danger">این فیلد الزامی است</p>
            )}
          </div>
          <DatePickerComponent
            setDate={setPaymentDeadLine}
            dateRef={paymentDeadLineRef}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 w-full">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between">
            <label className="text-sm text-dark">قرائت کنونی</label>
            {check && !currentReading && (
              <p className="text-xs text-danger">این فیلد الزامی است</p>
            )}
          </div>
          <DatePickerComponent
            setDate={setCurrentReading}
            dateRef={currentReadingRef}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between">
            <label className="text-sm text-dark">قرائت پیشین</label>
            {check && !previousReading && (
              <p className="text-xs text-danger">این فیلد الزامی است</p>
            )}
          </div>
          <DatePickerComponent
            setDate={setPreviousReading}
            dateRef={previousReadingRef}
          />
        </div>
        <InputForm
          name="period"
          title="دوره"
          onChange={(e) => setPeriod(e.target.value)}
          type={"text"}
          check={check}
          placeholder="دوره"
          value={period}
        />
      </div>
      <div className="flex items-center gap-2 w-full">
        <InputForm
          name="totalDays"
          title="تعداد کل روزهای دوره"
          onChange={(e) => setTotalDays(e.target.value)}
          type={"text"}
          check={check}
          placeholder="تعداد کل روزهای دوره"
          value={totalDays}
        />
        <InputForm
          name="totalPeriod"
          title="مصرف کل دوره"
          onChange={(e) => setTotalPeriod(e.target.value)}
          type={"text"}
          check={check}
          placeholder="مصرف کل دوره"
          value={totalPeriod}
        />
        <InputForm
          name="averageThirtyDay"
          title="متوسط مصرف 30 روز"
          onChange={(e) => setAverageThirtyDay(e.target.value)}
          type={"text"}
          check={check}
          placeholder="متوسط مصرف 30 روز"
          value={averageThirtyDay}
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

export default FormWaterBill;
