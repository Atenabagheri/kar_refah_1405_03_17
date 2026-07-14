import React from "react";
import type { MeterListType } from "../../../types/types";
// import DeleteButton from "../../../ui/DeleteButton";

type PropsType = {
  meterType?: "gas" | "electricity" | "water" | "green";
  meter: MeterListType;
  nembers: number;
  setSerialNumberSelect: React.Dispatch<React.SetStateAction<string | null>>;
  setBillIdentifier: React.Dispatch<React.SetStateAction<string | null>>;
};
const SingleRow = React.memo(
  ({
    // meterType,
    meter,
    nembers,
    setSerialNumberSelect,
    setBillIdentifier,
  }: PropsType) => {
    const showBillsHandler = () => {
      setSerialNumberSelect(meter.serialNumber);
      setBillIdentifier(meter.billIdentifier);
    };

    // const [showTrash, setShowTrash] = useState(false);

    const place = meter?.building ? meter?.building : meter?.site;
    return (
      <tr
        onClick={showBillsHandler}
        // onMouseEnter={() => setShowTrash(true)}
        // onMouseLeave={() => setShowTrash(false)}
        className="cursor-pointer hover:bg-neutral-200 odd:bg-white"
      >
        <td className="w-[10%] whitespace-nowrap !py-2 text-center">
          {nembers}
        </td>
        <td className="w-[20%] whitespace-nowrap !py-2 text-center">
          {meter?.serialNumber}
        </td>
        <td className="w-[20%] whitespace-nowrap !py-2 text-center">
          {meter?.billIdentifier}
        </td>

        {/* <td className="w-[15%] whitespace-nowrap !py-2 text-center">
          {meter?.type === "hqs"
            ? "ستاد(وزارتخانه)"
            : meter?.type === "province"
              ? "استانی"
              : "نامشخص"}
        </td> */}
        <td className="w-[15%] whitespace-nowrap !py-2 text-center">
          {place?.province?.faName}
        </td>
        <td className="w-[15%] whitespace-nowrap !py-2 text-center">
          {place?.city?.faName || place?.county?.faName}
        </td>
        <td className="w-[20%] whitespace-nowrap !py-2 text-center relative">
          {place?.name || "-"}
          {/* {showTrash && (
            <DeleteButton
              url={`/api/${meterType}-meter/delete-${meterType}-meter/${meter.serialNumber}`}
            />
          )} */}
        </td>
      </tr>
    );
  },
);

export default SingleRow;
