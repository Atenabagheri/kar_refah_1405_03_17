import { PiTrashSimple } from "react-icons/pi";
import { convertDateToFa } from "../../../../../helper/convertDateToFa";
import type { GreenBillType } from "../../../../../types/types";
import { useAppSelector } from "../../../../../redux/hooks";

interface PropsType {
  bill: GreenBillType;
  setTab: React.Dispatch<React.SetStateAction<string>>;
  setShowModal: React.Dispatch<
    React.SetStateAction<{
      _id: string;
      serialNumber?: string;
      billIdentifier?: string;
    } | null>
  >;
}

const GreenBillItem = ({ bill, setShowModal }: PropsType) => {
  const { user } = useAppSelector((state) => state.auth);

  // const handleClick = () => {
  //   setTab("profile");
  // };

  const averageThirtyPeriod = (bill?.totalPeriod / bill?.totalDays) * 30;

  const deleteHandler = ({
    _id,
    serialNumber,
    billIdentifier,
  }: {
    _id: string;
    serialNumber?: string;
    billIdentifier?: string;
  }) => {
    setShowModal({ _id, serialNumber, billIdentifier });
  };
  return (
    <tr
      className="cursor-pointer hover:bg-orange-100 odd:bg-white"
      // onClick={handleClick}
    >
      <td className="w-[10%] whitespace-nowrap !py-2 text-center">
        {bill?.period}
      </td>
      <td className="w-[15%] whitespace-nowrap !py-2 text-center">
        {convertDateToFa(bill?.previousReading)}
      </td>
      <td className="w-[15%] whitespace-nowrap !py-2 text-center">
        {convertDateToFa(bill?.currentReading)}
      </td>
      <td className="w-[20%] whitespace-nowrap !py-2 text-center">
        {bill?.totalDays}
      </td>
      <td className="w-[20%] whitespace-nowrap !py-2 text-center">
        {bill?.totalPeriod}
      </td>
      <td className="w-[20%] whitespace-nowrap !py-2 text-center relative">
        {averageThirtyPeriod}

        {user?.isAdmin && (
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              e.stopPropagation();
              deleteHandler({
                _id: bill?._id as string,
                serialNumber: bill?.serialNumber.serialNumber as string,
                billIdentifier: bill?.billIdentifier as string,
              });
            }}
            className="hover:bg-danger/20 rounded-md !p-1 cursor-pointer absolute left-2 top-1/2 -translate-y-1/2"
          >
            <PiTrashSimple className="text-xl text-danger" />
          </button>
        )}
      </td>
    </tr>
  );
};

export default GreenBillItem;
