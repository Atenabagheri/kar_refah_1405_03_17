import { useNavigate } from "react-router";
import type { AssetsType } from "../types/types";

interface PropsType {
  name: string;
  items: AssetsType[];
}
const AssetsCard = ({ name, items }: PropsType) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col !gap-4 border-b border-secondary/20 last:border-none !pb-3">
      <div className="flex items-center gap-1">
        <span className="text-sm">دسته‌بندی :</span>
        <div className="text-sm bg-danger/10 !p-1 !px-2 rounded-md">
          <span>{name}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-3 !gap-3">
        {items?.map((asset) => (
          <div
            onClick={() =>
              navigate(`/general/asset/${asset?.serialNumber}`)
            }
            className="bg-primary/20 text-center cursor-pointer max-w-[200px] min-h-[60px] flex flex-col items-center justify-center text-dark rounded-xl !p-1.5 !space-y-3"
            key={asset?.serialNumber}
          >
            <div className="text-sm">{asset?.name}</div>
            <div className="text-xs">{asset?.serialNumber}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetsCard;
