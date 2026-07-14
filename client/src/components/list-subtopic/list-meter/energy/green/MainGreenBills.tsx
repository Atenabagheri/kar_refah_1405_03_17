import { PiListBulletsLight, PiX } from "react-icons/pi";
import Modal from "../../../../../ui/Modal";
import { useEffect, useState } from "react";
import GreenBillsList from "./GreenBillsList";
import GreenBillProfile from "./GreenBillProfile";
// import DeleteButton from "../../../../../ui/DeleteButton";
import { useAppSelector } from "../../../../../redux/hooks";
import DeleteButton from "../../../../../ui/DeleteButton";

interface PropsType {
  closeHandler: () => void;
  serialNumberSelect: string | null;
  billIdentifier: string | null;
}

const MainGreenBills = ({
  closeHandler,
  serialNumberSelect,
  billIdentifier,
}: PropsType) => {
  const { user } = useAppSelector((state) => state.auth);
  const [tab, setTab] = useState("list");
  const [filterByDate, setFilterByDate] = useState<string>("");
  const { deleteId } = useAppSelector((state) => state.ui);

  useEffect(() => {
    if (
      serialNumberSelect &&
      deleteId?.endsWith(`/delete-green-meter/${serialNumberSelect}`)
    ) {
      closeHandler();
    }
  }, [deleteId, closeHandler, serialNumberSelect]);
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

            {user?.isAdmin && (
              <DeleteButton
                title={`کنتور ${serialNumberSelect}`}
                origin="profile"
                url={`/api/green-meter/delete-green-meter/${serialNumberSelect}`}
              />
            )}
          </div>
          <div className="flex items-center gap-5">
            {tab !== "list" && (
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
            <GreenBillsList
              filterByDate={filterByDate}
              setFilterByDate={setFilterByDate}
              billIdentifier={billIdentifier}
              setTab={setTab}
            />
          ) : (
            <GreenBillProfile />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default MainGreenBills;
