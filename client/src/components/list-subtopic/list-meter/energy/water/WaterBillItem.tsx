import { convertDateToFa } from "../../../../../helper/convertDateToFa";
import { priceType } from "../../../../../helper/pricetype";
import type { WaterBillType } from "../../../../../types/types";

interface PropsType {
  bill: WaterBillType;
  setTab: React.Dispatch<React.SetStateAction<string>>;
  setPayment: React.Dispatch<React.SetStateAction<string>>;
}

const WaterBillItem = ({ bill, setTab, setPayment }: PropsType) => {
  const handleClick = (payment: string) => {
    setTab("profile");
    setPayment(payment);
  };
  return (
    <tr
      className="cursor-pointer hover:bg-blue-100 odd:bg-white"
      onClick={() => handleClick(bill?.paymentIdentifier)}
    >
      <td className="w-[5%] whitespace-nowrap !py-2 text-center">
        {bill?.period}
      </td>
      <td className="w-[10%] whitespace-nowrap !py-2 text-center">
        {convertDateToFa(bill?.previousReading)}
      </td>
      <td className="w-[10%] whitespace-nowrap !py-2 text-center">
        {convertDateToFa(bill?.currentReading)}
      </td>
      <td className="w-[10%] whitespace-nowrap !py-2 text-center">
        {bill?.totalDays}
      </td>
      <td className="w-[15%] whitespace-nowrap !py-2 text-center">
        {bill?.totalPeriod}
      </td>
      <td className="w-[20%] whitespace-nowrap !py-2 text-center">
        {bill?.averageThirtyDay}
      </td>
      <td className="w-[15%] whitespace-nowrap !py-2 text-center">
        {bill?.paymentIdentifier}
      </td>
      <td className="w-[15%] whitespace-nowrap !py-2 text-center">
        {priceType(bill?.totalBillDebt)}
      </td>
    </tr>
  );
};

export default WaterBillItem;
