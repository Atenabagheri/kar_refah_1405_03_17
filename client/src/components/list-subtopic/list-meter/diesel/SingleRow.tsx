import React from "react";
import type { DieselType } from "../../../../types/types";
import { priceType } from "../../../../helper/pricetype";
import { convertDateToFa } from "../../../../helper/convertDateToFa";
// import DeleteButton from "../../../../ui/DeleteButton";

type PropsType = {
  data: DieselType;
  nembers: number;
  setDocumentNumberSelect: React.Dispatch<React.SetStateAction<string | null>>;
};
const SingleRow = ({ data, nembers, setDocumentNumberSelect }: PropsType) => {
  const showBillsHandler = () => {
    setDocumentNumberSelect(data.documentNumber);
  };

  // const [showTrash, setShowTrash] = useState(false);

  const place = data?.building ? data?.building : data?.site;

  return (
    <tr
      onClick={showBillsHandler}
      // onMouseEnter={() => setShowTrash(true)}
      // onMouseLeave={() => setShowTrash(false)}
      className="cursor-pointer odd:bg-white hover:bg-neutral-200"
    >
      {/* ردیف 5 */}
      <td className="w-[5%] whitespace-nowrap !py-2 text-center">{nembers}</td>
      {/* تاریخ خرید 15 */}
      <td className="w-[15%] whitespace-nowrap !py-2 text-center">
        {convertDateToFa(data?.purchaseDate) || "-"}
      </td>
      {/* شماره نیاز 25 */}
      <td className="w-[20%] whitespace-nowrap !py-2 text-center">
        {data?.documentNumber}
      </td>
      {/* محل تخلیه 25 */}
      <td className="w-[30%] !py-2 text-center">
        {place ? (
          <div className="flex flex-col">
            <span>{place.name}</span>
            <span className="bg-secondary/20 rounded-md text-xs !p-0.5">
              {place.address}
            </span>
          </div>
        ) : (
          "-"
        )}
      </td>

      {/* میزان خرید 15 */}
      <td className="w-[15%] whitespace-nowrap !py-2 text-center">
        {data?.quantity || "-"}
      </td>
      {/* مبلغ خرید 15 */}
      <td className="w-[15%] whitespace-nowrap !py-2 text-center relative">
        {priceType(+data?.amount) || "-"}
        {/* {showTrash && (
          <DeleteButton
            url={`/api/diesel/delete-diesel/${data.documentNumber}`}
          />
        )} */}
      </td>
    </tr>
  );
};

export default SingleRow;
