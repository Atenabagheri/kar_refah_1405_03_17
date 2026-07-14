import { useNavigate } from "react-router";
import type { VehicleType } from "../../../types/types";
import LicensePlate from "../../../ui/LicensePlate";
import React from "react";
import DeleteButton from "../../../ui/DeleteButton";

interface PropsType {
  vehicle: VehicleType;
  row: number;
}

const VehicleListItem = React.memo(({ vehicle, row }: PropsType) => {
  const navigate = useNavigate();
  const navigateHandler = () => {
    navigate(`/support/vehicle/${vehicle?.vin}`);
  };

  const showTrash = false;
  // const [showTrash, setShowTrash] = useState(false);

  return (
    <tr
      className="cursor-pointer border-b border-secondary/20 text-xs 2xl:text-sm border-b-caspian-gray2 whitespace-nowrap odd:bg-white hover:bg-neutral-200"
      onClick={navigateHandler}
      // onMouseEnter={() => setShowTrash(true)}
      // onMouseLeave={() => setShowTrash(false)}
    >
      {/* ردیف 5 */}
      <td className="w-[5%] whitespace-nowrap !py-2 text-center">
        <span className="max-w-[90%] !mx-auto truncate">{row}</span>
      </td>
      {/* نوع خودرو 10 */}
      <td
        className="w-[10%] whitespace-nowrap !py-2 text-center"
        title={vehicle?.vehicleType?.faName}
      >
        <span className="max-w-[90%] !mx-auto truncate">
          {vehicle?.vehicleType?.faName}
        </span>
      </td>
      {/* مدل خودرو 10 */}
      <td
        className="w-[10%] whitespace-nowrap !py-2 text-center"
        title={vehicle?.model}
      >
        <span className="max-w-[90%] !mx-auto truncate">{vehicle?.model}</span>
      </td>
      {/* پلاک 15 */}
      <td
        className="w-[15%] whitespace-nowrap truncate !py-2 text-center"
        title={vehicle?.licensePlate}
      >
        <div className="max-w-[90%] flex items-center justify-center">
          <LicensePlate licensePlate={vehicle?.licensePlate} />
        </div>
      </td>
      {/* شماره شاسی 15 */}
      <td className="w-[15%] whitespace-nowrap truncate !py-2 text-center">
        <span className="max-w-[90%] !mx-auto font-sans">{vehicle?.vin}</span>
      </td>
      {/* شماره موتور 15 */}
      <td className="w-[15%] whitespace-nowrap truncate !py-2 text-center">
        <span className="max-w-[90%] !mx-auto font-sans">
          {vehicle?.engineNumber}
        </span>
      </td>
      {/* رنگ 10 */}
      <td className="w-[10%] whitespace-nowrap truncate !py-2 text-center">
        <span className="max-w-[90%] !mx-auto">{vehicle?.color}</span>
      </td>
      {/* بهره‌بردار 10 */}
      <td className="w-[10%] whitespace-nowrap truncate !py-2 text-center">
        <span className="max-w-[90%] !mx-auto">
          {vehicle?.operatorType === "special"
            ? vehicle.operatorSpecial.firstName +
              " " +
              vehicle.operatorSpecial.lastName
            : vehicle?.operatorType === "general"
              ? vehicle.operatorGeneral.faName
              : "نامشخص"}
        </span>
      </td>
      {/* راننده 10 */}
      <td className="w-[10%] whitespace-nowrap truncate !py-2 text-center relative">
        <span className="max-w-[90%] !mx-auto">
          {vehicle?.wheelman
            ? vehicle?.wheelman?.firstName + " " + vehicle?.wheelman?.lastName
            : "نا مشخص"}
        </span>
        {showTrash && (
          <DeleteButton url={`/api/vehicle/delete-vehicle/${vehicle.vin}`} />
        )}
      </td>
    </tr>
  );
});

export default VehicleListItem;
