import { useParams } from "react-router";
import MainFormProvince from "./form-public/form-province/MainFormProvince";
import MainFormCounty from "./form-public/form-county/MainFormCounty";
import MainFormUnitPost from "./form-unit-post/MainFormUnitPost";
import MainFormCity from "./form-public/form-city/MainFormCity";
import MainFormDateCategory from "./Form-date-category/MainFormDateCategory";
import NotFound from "../../pages/NotFound";
import MainFormBulding from "./form-building/building/MainFormBulding";
import MainFormRoom from "./form-building/room/MainFormRoom";
import MainFormPosition from "./form-position/MainFormPosition";
import MainFormEmployee from "./form-employee/MainFormEmployee";
import MainFormVehicle from "./form-vehicle/vehicle/MainFormVehicle";
import MainFormInsurance from "./form-vehicle/insurance/MainFormInsurance";
import MainFormWaterMeter from "./form-energy/water/water-meter/MainFormWaterMeter";
import MainFormGasMeter from "./form-energy/gas/gas-meter/MainFormGasMeter";
import MainFormElectricityMeter from "./form-energy/electricity/electricity-meter/MainFormElectricityMeter";
import MainFormWaterBill from "./form-energy/water/water-bill/MainFormWaterBill";
import MainFormGasBill from "./form-energy/gas/gas-bill/MainFormGasBill";
import MainFormDiesel from "./form-energy/diesel/MainFormDiesel";

const MainFormSubTopic = () => {
  const { form, subform } = useParams();

  return form === "water" && subform === "water-meter" ? (
    <MainFormWaterMeter />
  ) : form === "water" && subform === "water-bill" ? (
    <MainFormWaterBill />
  ) : form === "gas" && subform === "gas-meter" ? (
    <MainFormGasMeter />
  ) : form === "gas" && subform === "gas-bill" ? (
    <MainFormGasBill />
  ) : form === "electricity" && subform === "electricity-meter" ? (
    <MainFormElectricityMeter />
  ) : form === "diesel" && subform === "profile" ? (
    <MainFormDiesel />
  ) : form === "building" && subform === "profile" ? (
    <MainFormBulding />
  ) : form === "building" && subform === "room" ? (
    <MainFormRoom />
  ) : form === "position" && subform === "profile" ? (
    <MainFormPosition />
  ) : form === "vehicle" && subform === "profile" ? (
    <MainFormVehicle />
  ) : form === "vehicle" && subform === "insurance" ? (
    <MainFormInsurance />
  ) : form === "employee" && subform === "profile" ? (
    <MainFormEmployee />
  ) : form === "hr" && subform === "unit-position" ? (
    <MainFormUnitPost />
  ) : form === "general" && subform === "date-category" ? (
    <MainFormDateCategory />
  ) : form === "general" && subform === "province" ? (
    <MainFormProvince />
  ) : form === "general" && subform === "county" ? (
    <MainFormCounty />
  ) : form === "general" && subform === "city" ? (
    <MainFormCity />
  ) : (
    <NotFound />
  );
};

export default MainFormSubTopic;
