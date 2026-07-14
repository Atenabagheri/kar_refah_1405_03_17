import { PiTrashSimple, PiX } from "react-icons/pi";
import { useCallback, useState } from "react";
import ModalParent from "../../../../ui/ModalParent";
import MainElectricityBills from "./electrictity/MainElectricityBills";
import MainWaterBills from "./water/MainWaterBills";
import MainGasBills from "./gas/MainGasBills";
import Modal from "../../../../ui/Modal";
import DeleteComponent from "./DeleteComponent";
import { useAppSelector } from "../../../../redux/hooks";
// import DeleteButton from "../../../../ui/DeleteButton";

interface PropsType {
  data: {
    serialNumber: string;
    billIdentifier: string;
  }[];
  setShow: React.Dispatch<React.SetStateAction<string | null>>;
  meter: string;
}

const MetersList = ({ data, meter, setShow }: PropsType) => {
  const { user } = useAppSelector((state) => state.auth);
  const [showDetails, setShowDetails] = useState(false);

  const [billIdentifier, setBillIdentifier] = useState<string | null>(null);
  const [serialNumberSelect, setSerialNumberSelect] = useState<string | null>(
    null,
  );
  const closeHandler = useCallback(() => {
    setShowDetails(false);
    setSerialNumberSelect(null);
    setBillIdentifier(null);
  }, []);
  const showDetailsHandle = (billId: string, serialNumber: string) => {
    setSerialNumberSelect(serialNumber);
    setBillIdentifier(billId);
    setShowDetails(true);
  };

  const [showModal, setShowModal] = useState<{
    serialNumber: string;
    billIdentifier: string;
  } | null>(null);

  const deleteHandler = ({
    serialNumber,
    billIdentifier,
  }: {
    serialNumber: string;
    billIdentifier: string;
  }) => {
    setShowModal({ serialNumber, billIdentifier });
  };
  return user?.isAdmin && showModal ? (
    <Modal className="min-w-[360px] bg-white rounded-xl !p-4 z-9999">
      <DeleteComponent
        showModal={showModal}
        setShowModal={setShowModal}
        url={`/api/${meter}-meter/delete-${meter}-meter/${showModal.serialNumber}`}
      />
    </Modal>
  ) : (
    <ModalParent>
      {showDetails && meter === "electricity" && (
        <MainElectricityBills
          closeHandler={closeHandler}
          billIdentifier={billIdentifier}
          serialNumberSelect={serialNumberSelect}
        />
      )}
      {showDetails && meter === "water" && (
        <MainWaterBills
          closeHandler={closeHandler}
          billIdentifier={billIdentifier}
          serialNumberSelect={serialNumberSelect}
        />
      )}
      {showDetails && meter === "gas" && (
        <MainGasBills
          closeHandler={closeHandler}
          billIdentifier={billIdentifier}
          serialNumberSelect={serialNumberSelect}
        />
      )}
      <div className="bg-white w-[450px] max-h-[300px] !py-3 rounded-md">
        <div className="flex items-center justify-between w-full !p-3 !pt-0 border-b border-secondary/50">
          <span className="text-sm font-semibold text-dark">کنتورها</span>
          <PiX onClick={() => setShow(null)} className="cursor-pointer" />
        </div>
        <div className="">
          <div
            className={`flex !p-1.5 ${meter === "water" ? "bg-info/50" : meter === "electricity" ? "bg-warning/50" : "bg-danger/50"}`}
          >
            <div className="w-[100px] text-sm text-dark">ردیف</div>
            <div className="w-full text-sm text-dark">شماره کنتور</div>
            <div className="w-full text-sm text-dark">
              شناسه قبض{" "}
              {meter === "gas" ? "گاز" : meter === "water" ? "آب" : "برق"}
            </div>
          </div>
          {data?.length < 1 ? (
            <p className="!p-1.5 text-sm">موردی یافت نشد</p>
          ) : (
            data?.map((d) => (
              <div
                className="flex !p-1.5 text-sm border-b border-secondary/50 last:border-none cursor-pointer relative"
                onClick={() =>
                  showDetailsHandle(d?.billIdentifier, d.serialNumber)
                }
                key={d?.serialNumber}
              >
                <span className="w-[100px] !pr-2">{data?.indexOf(d) + 1}</span>
                <p className="w-full">{d?.serialNumber}</p>
                <p className="w-full">{d?.billIdentifier}</p>
                {user?.isAdmin && (
                  <button
                    onClick={(
                      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                    ) => {
                      e.stopPropagation();
                      deleteHandler({
                        serialNumber: d.serialNumber as string,
                        billIdentifier: d.billIdentifier as string,
                      });
                    }}
                    className="hover:bg-danger/20 rounded-md !p-1 cursor-pointer"
                  >
                    <PiTrashSimple className="text-xl text-danger" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </ModalParent>
  );
};

export default MetersList;
