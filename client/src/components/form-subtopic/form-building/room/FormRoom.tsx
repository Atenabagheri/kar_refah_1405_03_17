import { useEffect, useRef, useState } from "react";
import InputForm from "../../../../ui/InputForm";
import SubmitButton from "../../../../ui/SubmitButton";
import TextAreaForm from "../../../../ui/TextAreaForm";
import api from "../../../../../api/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { type ImageListType } from "react-images-uploading";
import ImageUpload from "../../ImageUpload";
import GalleryUpload from "../../GalleryUpload";
import type {
  BuildingType,
  FloorType,
  SelectFormDataType,
} from "../../../../types/types";
import SelectFormGlobal from "../../../../ui/SelectFormGlobal";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { fetchProvinces } from "../../../../redux/slices/dashboard/provinceSlice";
import { fetchCountyWithProvince } from "../../../../redux/slices/subtopics/county/countySlice";
import { fetchCityWithCounty } from "../../../../redux/slices/subtopics/city/citySlice";
import SelectForm from "../../../../ui/SelectForm";
import SelectBySearchBuilding from "../../SelectBySearchBuilding";

interface IOption {
  value: string;
  label: string;
}

export interface ChildRef {
  triggerFunction: () => void;
}
const FormRoom = () => {
  const dispatch = useAppDispatch();

  const selectRef: React.RefObject<ChildRef | null> = useRef(null);
  const [check, setCheck] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [number, setNumber] = useState<string | number>("");
  const [floor, setFloor] = useState<FloorType[]>([]);
  const [floorSelected, setFloorSelected] = useState<FloorType | undefined>(
    undefined,
  );
  const [usage, setUsage] = useState<IOption[]>([]);
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
    if (!name || name?.length < 2 || !floor || !selectBuilding) {
      setCheck(true);
      return;
    }
    setCheck(false);
    setLoading(true);

    const formData = new FormData();

    formData.append("building", selectBuilding?.postalCode as string);
    formData.append("name", name as string);
    formData.append("description", description as string);
    formData.append("number", number as string);
    formData.append("type", type as string);
    formData.append("floor", floorSelected?.number as string);
    usage.forEach((u) => {
      formData.append("usage", u.value);
    });
    formData.append("image", image[0]?.file as string | Blob);
    images.forEach((image) => {
      formData.append("gallery", image.file as string | Blob);
    });
    try {
      const res = await api.post(`/api/room/add-room`, formData, {
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
    setFloor([]);
    setFloorSelected(undefined);
    setUsage([]);

    setType("");
    setDescription("");
    setImage([]);
    setImages([]);
    setSelectBuilding(null);
    selectRef?.current?.triggerFunction();
  };

  useEffect(() => {
    const getFloor = async () => {
      try {
        const res = await api.get(`/api/floor/get-floors`);
        // console.log(res?.data);;
        setFloor(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFloor();
  }, []);

  return (
    <div
      // onSubmit={formHandler}
      className="w-full md:w-[90%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%] !space-y-5 !p-3 bg-light border border-secondary/50 rounded-md"
    >
      <div className="flex items-center gap-2 justify-between">
        <InputForm
          name="name"
          title="عنوان اتاق"
          onChange={(e) => setName(e.target.value)}
          type={"text"}
          check={check}
          placeholder="عنوان اتاق"
          value={name}
        />
      </div>
      <div className="flex gap-2 w-full">
        <InputForm
          name="number"
          title="شماره اتاق"
          onChange={(e) => setNumber(e.target.value)}
          type={"text"}
          check={check}
          placeholder="شماره اتاق"
          value={number}
        />
        <SelectFormGlobal
          label={"انتخاب طبقه"}
          data={floor}
          selected={floorSelected}
          setSelected={setFloorSelected}
          check={check}
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
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center justify-between">
          <label className="text-sm text-dark">انتخاب ساختمان:</label>
          {check && !selectBuilding && (
            <p className="text-xs text-danger">این فیلد الزامی است</p>
          )}
        </div>
        <SelectBySearchBuilding
          selectBuilding={selectBuilding}
          setSelectBuilding={setSelectBuilding}
          ref={selectRef}
          county={selectedCounty?.name}
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

export default FormRoom;
