type DataType = {
  title: string;
  value?: string | number;
};
type PropsType = {
  data: DataType[];
};
const SingleCartInfo = ({ data }: PropsType) => {
  return data.map((d: DataType, index: number) => (
    <div key={index} className="flex items-center gap-0 odd:bg-dark/5">
      <span
        className={`basis-1/2 !p-2`}
      >
        {d.title}:{" "}
      </span>
      <span
        className={`basis-1/2 !p-2`}
      >
        {d.value}
      </span>
    </div>
  ));
};

export default SingleCartInfo;
