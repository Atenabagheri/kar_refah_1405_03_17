type DataType = {
  title: string;
  count: number;
};
type PropsType = {
  data: DataType[];
};
const SingleCart = ({ data }: PropsType) => {
  return data.map((d: DataType, index: number) => (
    <div key={index} className="flex items-center gap-0 even:bg-dark/5">
      <span
        className={`basis-1/2 !p-2`}
      >
        {d.title}:{" "}
      </span>
      <span
        className={`basis-1/2 !p-2`}
      >
        {d.count}
      </span>
    </div>
  ));
};

export default SingleCart;
