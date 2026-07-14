import { useNavigate } from "react-router";
import type { PositionType } from "../../../types/types";
import React from "react";
import DeleteButton from "../../../ui/DeleteButton";

interface PropsType {
  position: PositionType;
}

const PositionListItem = React.memo(({ position }: PropsType) => {
  const navigate = useNavigate();
  const navigateHandler = () => {
    navigate(`/general/position/${position?.code}`);
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
        className="w-[20%] whitespace-nowrap !py-2 text-center"
        title={position?.code}
      >
        {position?.code}
      </td>

      <td
        className="w-[30%] whitespace-nowrap !py-2 text-center"
        title={position?.title}
      >
        <p className="max-w-[90%] !mx-auto truncate text-center">
          {position?.title}
        </p>
      </td>

      <td
        className="w-[40%] whitespace-nowrap truncate !py-2 text-center"
        title={position?.description}
      >
        <p className="max-w-[90%] !mx-auto truncate text-center">
          {position?.description}
        </p>
      </td>

      <td
        className="w-[10%] whitespace-nowrap truncate !py-2 text-center relative"
        // title={position?.maxEmployees}
      >
        {position?.maxEmployees}
        {showTrash && (
          <DeleteButton
            url={`/api/position/delete-position/${position.code}`}
          />
        )}
      </td>
    </tr>
  );
});

export default PositionListItem;
