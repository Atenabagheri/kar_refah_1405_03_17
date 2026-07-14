import { PiChartBarDuotone, PiListBulletsLight, PiX } from "react-icons/pi";
import Modal from "../../../../../ui/Modal";
import { useEffect, useState } from "react";
import MainChart from "./chart/MainChart";
import ElectricityBillProfile from "./ElectricityBillProfile";
import ElectricityBillsList from "./ElectricityBillsList";
import GetElectricityBill from "../../electricity/GetElectricityBill";
// import DeleteButton from "../../../../../ui/DeleteButton";
import { useAppSelector } from "../../../../../redux/hooks";

interface PropsType {
  closeHandler: () => void;
  serialNumberSelect: string | null;
  billIdentifier: string | null;
}

const MainElectricityBills = ({
  closeHandler,
  serialNumberSelect,
  billIdentifier,
}: PropsType) => {
  const [tab, setTab] = useState("list");
  const [filterByDate, setFilterByDate] = useState<string>("");
  const [idProfile, setIdProfile] = useState<string>("");
  const { deleteId } = useAppSelector((state) => state.ui);

  useEffect(() => {
    if (
      serialNumberSelect &&
      deleteId?.endsWith(`/delete-electricity-bill/${serialNumberSelect}`)
    ) {
      closeHandler();
    }
  }, [deleteId, closeHandler, serialNumberSelect]);

  console.log({ billIdentifier });
  return (
    <Modal className="w-[90%]">
      <div className="bg-white w-full rounded-md">
        <div className="w-full flex items-center justify-between !p-3 border-b border-secondary/50">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <img
                src="/assets/images/building/tavanir.webp"
                alt="شرکت توزیع نیروی برق"
                width={128}
                height={128}
                className="w-12 h-12 !p-1"
              />
              <div className="flex flex-col gap-1">
                <span className="text-sm">
                  قبض‌های کنتور با شناسه قبض {billIdentifier}
                </span>
                <span className="text-neutral-500 text-xs">
                  شرکت توزیع نیروی برق
                </span>
              </div>
            </div>

            {/* <DeleteButton
              title={`کنتور ${serialNumberSelect}`}
              origin="profile"
              url={`/api/electricity-meter/delete-electricity-meter/${serialNumberSelect}`}
            /> */}
          </div>

          <div className="flex items-center gap-5">
            {tab === "list" ? (
              <div className="flex items-center gap-2">
                <GetElectricityBill billIdentifier={billIdentifier} />
                <button
                  onClick={() => setTab("comparison")}
                  className="bg-warning/80 !p-1.5 text-dark text-lg rounded-full cursor-pointer"
                >
                  <PiChartBarDuotone />
                </button>
              </div>
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
            <ElectricityBillsList
              filterByDate={filterByDate}
              setFilterByDate={setFilterByDate}
              // serialNumberSelect={serialNumberSelect}
              billIdentifier={billIdentifier}
              setTab={setTab}
              setIdProfile={setIdProfile}
            />
          ) : tab === "comparison" ? (
            <MainChart
              filterByDate={filterByDate}
              billIdentifier={billIdentifier}
              // serialNumber={serialNumberSelect}
            />
          ) : (
            <ElectricityBillProfile id={idProfile} />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default MainElectricityBills;
