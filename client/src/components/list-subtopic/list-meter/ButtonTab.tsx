import { useQuery } from "../../../hooks/useQuery";

type PropsType = {
  title: string;
  type: string;
  disabled: boolean;
  src?: string;
};
const ButtonTab = ({ title, disabled, type, src }: PropsType) => {
  const { get, update } = useQuery();

  const m = get("meter");

  const meterSelected = (meter: string) => {
    const disabled = !meter || meter === m || (!m && meter === "electricity");
    if (disabled) return;
    update({ meter: meter, postalCode: null, page: "1" });
  };

  return (
    <button
      disabled={disabled}
      onClick={() => meterSelected(type)}
      className={`${type === "electricity" ? "bg-warning/70" : type === "water" ? "bg-info/50" : type === "gas" ? "bg-danger/50" : type === "green" ? "bg-success/70" : "bg-secondary/50"} min-w-[15%] !p-2 rounded-b-xl cursor-pointer disabled:cursor-default ${m === type && "!py-2.5"}`}
    >
      <div className="flex items-center justify-center gap-1">
        {title}

        <div className={`${src && "w-8"} h-8 flex items-center justify-center`}>
          {src && (
            <img
              src={src}
              alt={title}
              height={64}
              width={64}
              className="w-7 h-auto"
            />
          )}
        </div>
      </div>
    </button>
  );
};

export default ButtonTab;
