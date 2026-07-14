interface PropsType {
  title: string;
  icon?: React.ReactNode;
  value: string | number | undefined;
}

const BuildingInfo = ({ title, icon, value }: PropsType) => {
  return (
    <div className="flex flex-nowrap items-start gap-2">
      <div className="flex items-center !gap-2">
        {icon}
        <span className="text-dark/90 whitespace-nowrap">{title} :</span>
      </div>
      <p>{value}</p>
    </div>
  );
};

export default BuildingInfo;
