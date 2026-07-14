import type { VehicleType } from "../types/types";
import { useNavigate } from "react-router";
import LicensePlate from "./LicensePlate";

const VehicleCard = ({ vehicle }: { vehicle: VehicleType }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/support/vehicle/${vehicle?.vin}`)}
      className="bg-dark/10 shadow-md border border-dark/20 cursor-pointer w-full min-h-[60px] flex flex-col text-dark rounded-xl !p-1.5 !space-y-3"
    >
      <span>مدل: {vehicle.model}</span>
      <div className="flex items-center gap-2">
        <span>پلاک:</span>
        <LicensePlate licensePlate={vehicle.licensePlate} />
      </div>

      <span>شماره شاسی: {vehicle.vin}</span>
    </div>
  );
};

export default VehicleCard;
