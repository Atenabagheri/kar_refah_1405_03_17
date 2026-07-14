type PropsType = {
  currentPage: number;
  limit: number;
  total: number;
  rows: number;
};
const CounterList = ({ currentPage, limit, total, rows }: PropsType) => {
  const lastIndex = +currentPage * +limit;
  const firstIndex = +lastIndex - +limit;
  return (
    <div className="text-sm flex items-center gap-4">
      <span>نمایش {firstIndex + 1}</span>
      <span>تا {lastIndex - (+limit - rows)}</span>
      <span>از کل {total}</span>
    </div>
  );
};

export default CounterList;
