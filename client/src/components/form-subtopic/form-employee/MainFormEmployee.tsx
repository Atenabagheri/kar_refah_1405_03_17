import FormEmployee from "./FormEmployee";

const MainFormEmployee = () => {
  return (
    <div className="!p-4 !px-4 md:!px-10 flex flex-col gap-4">
      <h3>فرم ورود اطلاعات افراد</h3>
      <FormEmployee />
    </div>
  );
};

export default MainFormEmployee;
