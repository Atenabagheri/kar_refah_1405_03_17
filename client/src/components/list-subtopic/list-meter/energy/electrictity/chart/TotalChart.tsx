type TotalType = {
  firstYear: {
    value: number;
    year: string;
  };
  secondYear: {
    value: number;
    year: string;
  };
};

type PropsType = {
  total: TotalType | null;
  firstColor: string;
  secondColor: string;
  type: string;
};
const TotalChart = ({ total, firstColor, secondColor, type }: PropsType) => {
  const firstValue = total?.firstYear.value ?? 0;
  const secondValue = total?.secondYear.value ?? 0;

  const maxValue = Math.max(firstValue, secondValue);

  const firstPercent = maxValue ? Math.round((firstValue / maxValue) * 100) : 0;
  const secondPercent = maxValue
    ? Math.round((secondValue / maxValue) * 100)
    : 0;
  return (
    <div className="flex flex-col gap-2 !p-4">
      <div>
        <p className="text-sm text-dark text-center">
          نمودار مقایسه مصرف یکسال
        </p>
      </div>
      {/* سال اول */}
      <div className={`rounded-md bg-dark/5 shadow-md overflow-hidden`}>
        <div
          className={`h-full bg-[${firstColor}] !p-2 transition-all relative`}
          style={{ width: `${firstPercent}%` }}
        >
          <div className="absolute inset-0 bg-[url(/assets/images/diagonal-lines.svg)] bg-repeat bg-center opacity-20"></div>
          <div className="flex items-center justify-between text-sm text-dark font-medium min-w-max">
            <span>سال {total?.firstYear.year}</span>
            <span className="bg-white !p-1 rounded-lg shadow-md font-bold">
              {firstValue.toLocaleString()} {type}
            </span>
          </div>
        </div>
      </div>

      {/* سال دوم */}
      <div className={`rounded-md bg-dark/5 shadow-md overflow-hidden`}>
        <div
          className={`h-full bg-[${secondColor}] !p-2 transition-all relative`}
          style={{ width: `${secondPercent}%` }}
        >
          <div className="absolute inset-0 bg-[url(/assets/images/diagonal-lines.svg)] bg-repeat bg-center opacity-20"></div>
          <div className="flex items-center justify-between text-sm text-dark font-medium min-w-max">
            <span>سال {total?.secondYear.year}</span>
            <span className="bg-white !p-1 rounded-lg shadow-md font-bold">
              {secondValue.toLocaleString()} {type}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalChart;
