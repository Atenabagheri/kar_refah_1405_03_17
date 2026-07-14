import { useEffect, useState } from "react";
import InputForm from "../../../../ui/InputForm";
import SubmitButton from "../../../../ui/SubmitButton";
import TextAreaForm from "../../../../ui/TextAreaForm";
import {
  type DivisionType,
  type EmployeeType,
  type OptionsType,
  type SelectFormDataType,
  type VehicleBrandType,
  type VehicleTypeType,
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
import SelectFormVehicleType from "./SelectFormVehicleType";
import SelectFormVehicleBrand from "./SelectFormVehicleBrand";
import SelectFormEmployee from "./SelectFormEmployee";
import SelectFormDivision from "./SelectFormDivision";
import LicensePlate from "./LicensePlate";

const FormVehicle = () => {
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
  const [loading, setLoading] = useState<boolean>(false);

  const [vin, setVin] = useState<string>("");
  const [engineNumber, setEngineNumber] = useState<string>("");
  const [licensePlate, setLicensePlate] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [fuelType, setFuelType] = useState<
    "gasoline" | "diesel" | "electric" | "hybrid" | "cng" | "other" | ""
  >("");
  const [operatorType, setOperatorType] = useState<"special" | "general" | "">(
    "",
  );

  const [type, setType] = useState<"province" | "hqs" | "">("");
  const [model, setModel] = useState<string>("");

  // نوع ستادی/استانی
  const typeList: OptionsType[] = [
    { value: "hqs", name: "ستادی" },
    { value: "province", name: "استانی" },
  ];

  // نوع سوخت
  const typeFeul: OptionsType[] = [
    { value: "gasoline", name: "بنزین" },
    { value: "diesel", name: "گازوئیل" },
    { value: "electric", name: "برقی" },
    { value: "hybrid", name: "هیبرید" },
    { value: "cng", name: "سی ان جی" },
    { value: "other", name: "دیگر" },
  ];

  // نوع استفاده
  const typeOperator: OptionsType[] = [
    { value: "special", name: "بهره بردار اختصاصی" },
    { value: "general", name: "بهره بردار عمومی" },
  ];

  const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<ImageListType>([]);
  const [image, setImage] = useState<ImageListType>([]);

  const formHandler = async () => {
    // e.preventDefault();
    if (!vin || vin?.length < 2) {
      setCheck(true);
      return;
    }

    setCheck(false);
    setLoading(true);

    const formData = new FormData();

    formData.append("province", selectedProvince?.name as string);
    formData.append("county", selectedCounty?.name as string);
    formData.append("vin", vin as string);
    formData.append("engineNumber", engineNumber as string);
    formData.append("model", model as string);
    formData.append("operatorType", operatorType as string);
    formData.append("operatorSpecial", selectedEmployee?.nationalId as string);
    formData.append("wheelman", selectedWheelman?.nationalId as string);
    formData.append("operatorGeneral", selectedDivision?.code as string);
    formData.append("vehicleType", selectedVehicleType?.name as string);
    formData.append("brand", selectedVehicleBrand?.name as string);
    formData.append("color", color as string);
    formData.append("licensePlate", licensePlate as string);
    formData.append("description", description as string);
    formData.append("type", type as string);
    formData.append("image", image[0]?.file as string | Blob);
    images.forEach((image) => {
      formData.append("gallery", image.file as string | Blob);
    });
    try {
      const res = await api.post(`/api/vehicle/add-vehicle`, formData, {
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
    setVin("");
    setType("");
    setDescription("");
    setImage([]);
    setImages([]);
    setSelectedProvince(undefined);
    setSelectedCounty(undefined);
    // setVehicleTypes([]);
    // setVehicleBrands([]);
    setColor("");
    setEngineNumber("");
    // setDivisions([]);
    // setEmployees([]);
    setFuelType("");
    setLicensePlate("");
    setModel("");
    setOperatorType("");
    setSelectedWheelman(undefined);
    setSelectedVehicleType(undefined);
    setSelectedVehicleBrand(undefined);
  };

  const [vehicleTypes, setVehicleTypes] = useState<VehicleTypeType[]>([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState<
    VehicleTypeType | undefined
  >(undefined);
  useEffect(() => {
    const getVehicleTypes = async () => {
      try {
        const res = await api.get(`/api/vehicle-type/get-vehicle-types`);
        // console.log(res?.data);;
        setVehicleTypes(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getVehicleTypes();
  }, []);

  const [vehicleBrands, setVehicleBrands] = useState<VehicleBrandType[]>([]);
  const [selectedVehicleBrand, setSelectedVehicleBrand] = useState<
    VehicleBrandType | undefined
  >(undefined);
  useEffect(() => {
    const getVehicleBrands = async () => {
      try {
        const res = await api.get(`/api/vehicle-brand/get-vehicle-brands`);
        // console.log(res?.data);;
        setVehicleBrands(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getVehicleBrands();
  }, []);

  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<
    EmployeeType | undefined
  >(undefined);
  const [selectedWheelman, setSelectedWheelman] = useState<
    EmployeeType | undefined
  >(undefined);
  useEffect(() => {
    const getEmployees = async () => {
      try {
        const res = await api.get(`/api/employee/get-employees-form`);
        // console.log(res?.data);;
        setEmployees(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getEmployees();
  }, []);

  const [divisions, setDivisions] = useState<DivisionType[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<
    DivisionType | undefined
  >(undefined);
  useEffect(() => {
    const getDivisions = async () => {
      try {
        const res = await api.get(`/api/division/get-divisions`);
        // console.log(res?.data);;
        setDivisions(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getDivisions();
  }, []);
  return (
    <div
      // onSubmit={formHandler}
      className="w-full md:w-[90%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%] !space-y-5 !p-3 bg-light border border-secondary/50 rounded-md"
    >
      <LicensePlate setLicensePlate={setLicensePlate} />
      <div className="flex items-center gap-2 justify-between">
        <InputForm
          name="vin"
          title="شماره شاسی"
          onChange={(e) => setVin(e.target.value)}
          type={"text"}
          check={check}
          placeholder="شماره شاسی"
          value={vin}
        />
        <InputForm
          name="engineNumber"
          title="شماره موتور"
          onChange={(e) => setEngineNumber(e.target.value)}
          type={"text"}
          check={check}
          placeholder="شماره موتور"
          value={engineNumber}
        />
      </div>
      <div className="flex items-center gap-2 justify-between">
        <SelectFormVehicleType
          label={"نوع خودرو"}
          data={vehicleTypes}
          selected={selectedVehicleType}
          setSelected={setSelectedVehicleType}
          check={check}
        />
        <SelectFormVehicleBrand
          label={"برند خودرو"}
          data={vehicleBrands}
          selected={selectedVehicleBrand}
          setSelected={setSelectedVehicleBrand}
          check={check}
        />
        <InputForm
          name="model"
          title="مدل خودرو"
          onChange={(e) => setModel(e.target.value)}
          type={"text"}
          check={check}
          placeholder="مدل خودرو"
          value={model}
        />
      </div>
      <div className="flex items-center gap-2 justify-between">
        <StaticSelectForm
          title={"نوع سوخت"}
          name={"fuelType"}
          options={typeFeul}
          onChange={(e) =>
            setFuelType(
              e.target.value as
                | "gasoline"
                | "diesel"
                | "electric"
                | "hybrid"
                | "cng"
                | "other"
                | "",
            )
          }
          check={check}
          value={fuelType}
        />
        <InputForm
          name="color"
          title="رنگ خودرو"
          onChange={(e) => setColor(e.target.value)}
          type={"text"}
          check={check}
          placeholder="رنگ خودرو"
          value={color}
        />
      </div>
      <div className="flex items-center gap-2 justify-between">
        <SelectFormEmployee
          label={"انتخاب راننده"}
          data={employees}
          selected={selectedWheelman}
          setSelected={setSelectedWheelman}
          check={check}
        />
        <StaticSelectForm
          title={"نوع بهره بردار"}
          name={"operatorType"}
          options={typeOperator}
          onChange={(e) =>
            setOperatorType(e.target.value as "special" | "general" | "")
          }
          check={check}
          value={operatorType}
        />

        {operatorType === "special" ? (
          <SelectFormEmployee
            label={"انتخاب بهره بردار"}
            data={employees}
            selected={selectedEmployee}
            setSelected={setSelectedEmployee}
            check={check}
          />
        ) : operatorType === "general" ? (
          <SelectFormDivision
            label={"انتخاب بهره بردار"}
            data={divisions}
            selected={selectedDivision}
            setSelected={setSelectedDivision}
            check={check}
          />
        ) : (
          <div className="w-full"></div>
        )}
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

export default FormVehicle;
