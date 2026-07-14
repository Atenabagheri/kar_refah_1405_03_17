import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { type ImageListType } from "react-images-uploading";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchProvinces } from "../../../redux/slices/dashboard/provinceSlice";
import { fetchCountyWithProvince } from "../../../redux/slices/subtopics/county/countySlice";
import { fetchCityWithCounty } from "../../../redux/slices/subtopics/city/citySlice";
import api from "../../../../api/axios";
import InputForm from "../../../ui/InputForm";
import SelectForm from "../../../ui/SelectForm";
import TextAreaForm from "../../../ui/TextAreaForm";
import ImageUpload from "../ImageUpload";
import GalleryUpload from "../GalleryUpload";
import SubmitButton from "../../../ui/SubmitButton";
import {
  type PositionType,
  type RoomsType,
  type SelectFormDataType,
} from "../../../types/types";
import SelectBySearchRoom from "./SelectBySearchRoom";
import SelectBySearchPosition from "./SelectBySearchPosition";

export interface ChildRef {
  triggerFunction: () => void;
}
const FormEmployee = () => {
  const selectPositionRef: React.RefObject<ChildRef | null> = useRef(null);
  const selectRoomRef: React.RefObject<ChildRef | null> = useRef(null);

  const dispatch = useAppDispatch();
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState<string>("");
  const [password, setPassword] = useState("");

  const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<ImageListType>([]);
  const [image, setImage] = useState<ImageListType>([]);

  const [selectedPosition, setSelectedPosition] = useState<PositionType | null>(
    null,
  );

  const [selectedRoom, setSelectedRoom] = useState<RoomsType | null>(null);

  const formHandler = async () => {
    // e.preventDefault();
    if (
      !firstName ||
      firstName?.length < 2 ||
      !lastName ||
      lastName?.length < 2 ||
      !nationalId
    ) {
      setCheck(true);
      return;
    }
    if (nationalId.length !== 10) {
      setError("کد ملی باید 10 رقم باشد.");
      return;
    }
    setError("");
    setCheck(false);
    setLoading(true);

    const formData = new FormData();

    formData.append("province", selectedProvince?.name as string);
    formData.append("county", selectedCounty?.name as string);
    formData.append("nationalId", nationalId as string);
    formData.append("firstName", firstName as string);
    formData.append("lastName", lastName as string);
    formData.append("address", address as string);
    formData.append("phone", phone as string);
    formData.append("password", password as string);
    formData.append("description", description as string);
    formData.append("roomNumber", selectedRoom?.number as string);
    formData.append("positionCode", selectedPosition?.code as string);
    formData.append("image", image[0]?.file as string | Blob);
    images.forEach((image) => {
      formData.append("gallery", image.file as string | Blob);
    });
    try {
      const res = await api.post(`/api/employee/add-employee`, formData, {
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
    setFirstName("");
    setLastName("");
    setNationalId("");
    setAddress("");
    setPhone("");
    setPassword("");

    setImage([]);
    setImages([]);
    setSelectedProvince(undefined);
    setSelectedCounty(undefined);
    setSelectedPosition(null);
    setSelectedRoom(null);

    selectPositionRef?.current?.triggerFunction();
    selectRoomRef?.current?.triggerFunction();
  };

  return (
    <div
      // onSubmit={formHandler}
      className="w-full md:w-[90%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%] !space-y-5 !p-3 bg-light border border-secondary/50 rounded-md"
    >
      <div className="flex items-center gap-2 justify-between">
        <InputForm
          name="firstName"
          title="نام"
          onChange={(e) => setFirstName(e.target.value)}
          type={"text"}
          check={check}
          placeholder="نام"
          value={firstName}
        />
        <InputForm
          name="lastName"
          title="نام خانوادگی"
          onChange={(e) => setLastName(e.target.value)}
          type={"text"}
          check={check}
          placeholder="نام خانوادگی"
          value={lastName}
        />
      </div>
      <div className="flex gap-2 w-full">
        <InputForm
          name="phone"
          title="تلفن"
          onChange={(e) => setPhone(e.target.value)}
          type={"text"}
          check={check}
          placeholder="تلفن"
          value={phone}
        />

        <InputForm
          name="nationalId"
          title="کد ملی"
          onChange={(e) => setNationalId(e.target.value)}
          type={"text"}
          check={check}
          placeholder="کد ملی"
          value={nationalId}
          error={error}
        />
      </div>
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
        <SelectBySearchPosition
          ref={selectPositionRef}
          selectPosition={selectedPosition}
          setSelectPosition={setSelectedPosition}
        />
        <SelectBySearchRoom
          ref={selectRoomRef}
          selectRoom={selectedRoom}
          setSelectRoom={setSelectedRoom}
        />
      </div>

      <InputForm
        name="password"
        title="کلمه عبور"
        onChange={(e) => setPassword(e.target.value)}
        type={"text"}
        check={check}
        placeholder="کلمه عبور"
        value={password}
      />

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

export default FormEmployee;
