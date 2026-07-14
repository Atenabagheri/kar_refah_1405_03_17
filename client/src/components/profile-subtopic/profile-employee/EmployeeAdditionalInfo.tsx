interface PropsType {
  title: string;
  value: string;
}

const EmployeeAdditionalInfo = ({ title, value }: PropsType) => {
  return (
    <div className="!space-x-2">
      <span className="text-secondary">{title} :</span>
      <span>{value}</span>
    </div>
  );
};

export default EmployeeAdditionalInfo;
