import { useNavigate } from "react-router";
import type { AssetsType } from "../../../types/types";
import { PiCheck } from "react-icons/pi";
// import { useState } from "react";
import DeleteButton from "../../../ui/DeleteButton";

interface PropsType {
  asset: AssetsType;
}

const AssetListItem = ({ asset }: PropsType) => {
  const navigate = useNavigate();
  const navigateHandler = () => {
    navigate(`/general/asset/${asset?.serialNumber}`);
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
      <td
        className="w-[15%] whitespace-nowrap !py-2 text-center"
        // title={asset?.serialNumber}
      >
        {asset?.serialNumber}
      </td>

      <td
        className="w-[30%] whitespace-nowrap !py-2 text-center"
        title={asset?.name}
      >
        <p className="max-w-[90%] !mx-auto truncate text-center">
          {asset?.name}
        </p>
      </td>

      <td
        className="w-[20%] whitespace-nowrap truncate !py-2 text-center"
        title={asset?.description}
      >
        <p className="max-w-[90%] !mx-auto truncate text-center">
          {asset?.description}
        </p>
      </td>

      <td
        className="w-[25%] whitespace-nowrap truncate !py-2 text-center"
        // title={asset?.category}
      >
        {asset?.category?.name}
      </td>
      <td className="w-[5%] whitespace-nowrap truncate !py-2 text-center relative">
        {asset?.employee?.toString() ? <PiCheck className="!mx-auto" /> : ""}

        {showTrash && (
          <DeleteButton url={`/api/asset/delete-asset/${asset.serialNumber}`} />
        )}
      </td>
    </tr>
  );
};

export default AssetListItem;
