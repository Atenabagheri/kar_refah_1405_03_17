import ButtonTab from "./ButtonTab";
import FilterType from "../../../ui/FilterType";
import { useQuery } from "../../../hooks/useQuery";
import ProvinceSelector from "../../../ui/ProvinceSelector";
import { useAppSelector } from "../../../redux/hooks";

const MeterTab = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { get } = useQuery();
  const m = get("meter");

  return (
    <div
      className={`flex items-center justify-between border-t-5 ${!m || m === "electricity" ? "border-t-warning/70" : m === "water" ? "border-t-info/50" : m === "gas" ? "border-t-danger/50" : m === "green" ? "border-success/70" : "border-t-secondary/50"}`}
    >
      <div className={`w-full flex items-start gap-0`}>
        <ButtonTab
          disabled={!m || m === "electricity"}
          type="electricity"
          title="برق"
          src="/assets/images/building/tavanir.webp"
        />
        <ButtonTab
          disabled={m === "water"}
          type="water"
          title="آب"
          src="/assets/images/building/water.png"
        />
        <ButtonTab
          disabled={m === "gas"}
          type="gas"
          title="گاز"
          src="/assets/images/building/gas-logo.png"
        />
        <ButtonTab
          disabled={m === "green"}
          type="green"
          title="انرژی پاک"
          src="/assets/images/building/green-energy-white.png"
        />
        <ButtonTab
          disabled={m === "diesel"}
          type="diesel"
          title="گازوئیل"
          // src="/assets/images/building/gas-logo.png"
        />
      </div>
      {user?.roles === "MHQO" && (
        <div className="!pl-2 flex items-center gap-2">
          <ProvinceSelector />
          <FilterType />
        </div>
      )}
    </div>
  );
};

export default MeterTab;
