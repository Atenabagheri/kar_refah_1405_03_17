import FormBuilding from "./FormVehicle";

const MainFormVehicle = () => {
  return (
    <div className="!p-4 !px-4 md:!px-10 flex flex-col gap-4">
      <h3>فرم ورود اطلاعات خودرو</h3>
      <FormBuilding />
    </div>
  );
};

export default MainFormVehicle;
