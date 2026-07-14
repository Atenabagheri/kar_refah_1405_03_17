import type { DataType } from "./Home";

type PropsType = {
  dataMostEnergy: DataType[];
  dataLeastEnergy: DataType[];
  text: string;
};

const ListEnergy = ({ dataMostEnergy, dataLeastEnergy, text }: PropsType) => {
  return (
    <div className="flex items-center justify-center gap-2 w-full bg-white !p-4 rounded-lg rounded-tr-none">
      <div className="overflow-hidden rounded-lg shadow-md w-fit">
        <p className="text-center !p-2 bg-neutral-500 text-light">
          10 استان با بالاترین مصرف انرژی {text}
        </p>
        {dataMostEnergy.map((t: DataType) => (
          <div
            key={t.provinceName}
            className="flex items-center gap-2 w-72 bg-neutral-100 odd:bg-neutral-200 !p-2"
          >
            <span className="basis-1/2">{t.provinceFaName}</span>
            <span className="basis-1/2 text-center">{t.value}</span>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-lg shadow-md w-fit">
        <p className="text-center !p-2 bg-neutral-500 text-light">
          10 استان با پایین‌ترین مصرف انرژی {text}
        </p>
        {dataLeastEnergy.map((t) => (
          <div
            key={t.provinceName}
            className="flex items-center gap-2 w-72 bg-neutral-100 odd:bg-neutral-200 !p-2"
          >
            <span className="basis-1/2">{t.provinceFaName}</span>
            <span className="basis-1/2 text-center">{t.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListEnergy;
