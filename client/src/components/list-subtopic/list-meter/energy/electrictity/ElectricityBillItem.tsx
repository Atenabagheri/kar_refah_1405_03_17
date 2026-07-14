import { calcElectricity } from "../../../../../helper/calcElectricity";
import { priceType } from "../../../../../helper/pricetype";
import type { ElectricityBillType } from "../../../../../types/types";

interface PropsType {
  bill: ElectricityBillType;
  setTab: React.Dispatch<React.SetStateAction<string>>;
  setIdProfile: React.Dispatch<React.SetStateAction<string>>;
}

const ElectricityBillItem = ({ bill, setTab, setIdProfile }: PropsType) => {
  const handleClick = (payment: string) => {
    setTab("profile");
    setIdProfile(payment);
  };
  return (
    <tr
      className="cursor-pointer hover:bg-amber-100 odd:bg-white"
      onClick={() => handleClick(bill?._id)}
    >
      <td className="w-[5%] whitespace-nowrap !py-2 text-center">
        {bill?.salePrd}
      </td>
      <td className="w-[10%] whitespace-nowrap !py-2 text-center">
        {(bill?.prevReadingDate)}
      </td>
      <td className="w-[10%] whitespace-nowrap !py-2 text-center">
        {(bill?.readingDate)}
      </td>
      <td className="w-[10%] whitespace-nowrap !py-2 text-center">
        {bill?.totalDays}
      </td>
      <td className="w-[15%] whitespace-nowrap !py-2 text-center">
        {calcElectricity(bill.avgCost, bill.totalDays)}
      </td>
      <td className="w-[15%] whitespace-nowrap !py-2 text-center">
        {bill?.avgCost}
      </td>
      <td className="w-[20%] whitespace-nowrap !py-2 text-center">
        {bill?.patternMessage}
      </td>
      <td className="w-[15%] whitespace-nowrap !py-2 text-center">
        {priceType(bill?.billAmt)}
      </td>
    </tr>
  );
};

export default ElectricityBillItem;
