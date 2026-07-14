import FormElectricityMeter from "./FormElectricityMeter";

const MainFormElectricityMeter = () => {
  return (
    <div className="!p-4 !px-4 md:!px-10 flex flex-col gap-4">
      <h3>فرم ورود اطلاعات کنتور برق</h3>
      <FormElectricityMeter />
    </div>
  );
};

export default MainFormElectricityMeter;
