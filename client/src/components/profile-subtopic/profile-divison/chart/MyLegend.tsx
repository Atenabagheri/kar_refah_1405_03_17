interface PropsType {
  name: string;
  color: string;
}

const MyLegend = ({ name, color }: PropsType) => {
  return (
    <div className="flex items-center gap-2.5">
      <div style={{ backgroundColor: color }} className={`w-4 h-4`}></div>
      <span className="text-sm">{name}</span>
    </div>
  );
};

export default MyLegend;
