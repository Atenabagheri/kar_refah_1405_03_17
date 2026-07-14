import { PiChartBarDuotone, PiListBulletsLight, PiX } from "react-icons/pi";
import Modal from "../../../../../ui/Modal";
import { useEffect, useState } from "react";
import MainChart from "./chart/MainChart";
import GasBillsList from "./GasBillsList";
import GasBillProfile from "./GasBillProfile";
import DeleteButton from "../../../../../ui/DeleteButton";
import { useAppSelector } from "../../../../../redux/hooks";

interface PropsType {
  closeHandler: () => void;
  serialNumberSelect: string | null;
  billIdentifier: string | null;
}

const MainGasBills = ({
  closeHandler,
  // serialNumberSelect,
  billIdentifier,
}: PropsType) => {
  const { user } = useAppSelector((state) => state.auth);
  const [tab, setTab] = useState("list");
  const [filterByDate, setFilterByDate] = useState<string>("");
  const [payment, setPayment] = useState<string>("");

  const { deleteId } = useAppSelector((state) => state.ui);

  useEffect(() => {
    if (payment && deleteId?.endsWith(`/delete-gas-bill/${payment}`)) {
      setTab("list");
    }
  }, [deleteId, payment]);
  return (
    <Modal className="w-[90%]">
      <div className="bg-white w-full rounded-md">
        <div className="w-full flex items-center justify-between !p-3 border-b border-secondary/50">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <img
                src="/assets/images/building/gas-logo.png"
                alt="شرکت گاز"
                width={128}
                height={128}
                className="!p-2 w-12 h-12"
              />
              <div className="flex flex-col gap-1">
                <span className="text-sm">
                  قبض‌های کنتور با شناسه قبض {billIdentifier}
                </span>
                <span className="text-neutral-500 text-xs">اداره گاز</span>
              </div>
            </div>

            {user?.isAdmin && tab === "profile" && (
              <DeleteButton
                title={`قبض ${payment}`}
                origin="profile"
                url={`/api/gas-bill/delete-gas-bill/${payment}`}
              />
            )}
          </div>

          <div className="flex items-center gap-5">
            {tab === "list" ? (
              <button
                onClick={() => setTab("comparison")}
                className="bg-warning/80 !p-1.5 text-dark text-lg rounded-full cursor-pointer"
              >
                <PiChartBarDuotone />
              </button>
            ) : (
              <button
                onClick={() => setTab("list")}
                className="bg-primary/40 !p-1.5 text-dark text-lg rounded-full cursor-pointer"
              >
                <PiListBulletsLight />
              </button>
            )}
            <PiX onClick={closeHandler} className="cursor-pointer" />
          </div>
        </div>
        <div className="h-[80vh]">
          {tab === "list" ? (
            <GasBillsList
              filterByDate={filterByDate}
              setFilterByDate={setFilterByDate}
              // serialNumberSelect={serialNumberSelect}
              billIdentifier={billIdentifier}
              setTab={setTab}
              setPayment={setPayment}
            />
          ) : tab === "comparison" ? (
            <MainChart
              filterByDate={filterByDate}
              // serialNumber={serialNumberSelect}
              billIdentifier={billIdentifier}
            />
          ) : (
            <GasBillProfile payment={payment} />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default MainGasBills;
