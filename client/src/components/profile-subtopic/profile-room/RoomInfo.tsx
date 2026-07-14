interface PropsType {
  title: string;
  value: string | undefined;
}
const RoomInfo = ({ title, value }: PropsType) => {
  return (
    <div className="!space-x-2">
      <span className="text-dark/90 whitespace-nowrap">{title} :</span>
      <span>{value}</span>
    </div>
  );
};

export default RoomInfo;
