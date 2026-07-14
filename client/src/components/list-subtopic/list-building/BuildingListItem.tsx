import { useNavigate, useParams } from "react-router";
import type { BuildingType, ParamsType } from "../../../types/types";
import { usageType } from "./usageType";
import React from "react";
import DeleteButton from "../../../ui/DeleteButton";

interface PropsType {
  building: BuildingType;
  row: number;
}

const BuildingListItem = React.memo(({ building, row }: PropsType) => {
  const { topic, subtopic } = useParams<ParamsType>();
  const navigate = useNavigate();
  const navigateHandler = () => {
    navigate(`/${topic}/${subtopic}/${building?.postalCode}`);
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
      <td className="w-[5%] whitespace-nowrap !py-2 text-center">
        <p className="text-center">{row}</p>
      </td>
      <td
        className="w-[15%] whitespace-nowrap !py-2 text-center"
        title={building?.name}
      >
        <p className="max-w-[90%] !mx-auto truncate text-center">
          {building?.name}
        </p>
      </td>
      <td
        className="w-[10%] whitespace-nowrap !py-2 text-center"
        title={building?.province?.faName}
      >
        <p className="max-w-[90%] !mx-auto truncate text-center">
          {building?.province?.faName}
        </p>
      </td>
      <td
        className="w-[10%] whitespace-nowrap !py-2 text-center"
        title={building?.county?.faName}
      >
        <p className="max-w-[90%] !mx-auto truncate text-center">
          {building?.county?.faName || "_"}
        </p>
      </td>
      <td
        className="w-[10%] whitespace-nowrap !py-2 text-center"
        title={building?.city?.faName}
      >
        <p className="max-w-[90%] !mx-auto truncate text-center">
          {building?.city?.faName || "_"}
        </p>
      </td>

      <td
        className="w-[10%] whitespace-nowrap !py-2 text-center"
        title={building?.postalCode}
      >
        <p className="max-w-[90%] !mx-auto truncate text-center">
          {building?.postalCode}
        </p>
      </td>

      <td
        className="w-[10%] whitespace-nowrap !py-2 text-center"
        title={building?.postalCode}
      >
        <p className="max-w-[90%] !mx-auto truncate text-center">
          {building?.site?.name || "-"}
        </p>
      </td>

      <td
        className="w-[10%] whitespace-nowrap truncate !py-2 text-center"
        // title={building?.type}
      >
        <p className="text-center">
          {building?.type === "hqs"
            ? "ستاد(وزارتخانه)"
            : building?.type === "province"
              ? "استانی"
              : "مشخص نشده"}
        </p>
      </td>

      <td
        className="w-[10%] whitespace-nowrap truncate !py-2 text-center"
        title={building?.division?.faName}
      >
        <p className="max-w-[90%] !mx-auto truncate text-center">
          {building?.division?.faName || "_"}
        </p>
      </td>

      <td className="w-[15%] whitespace-nowrap truncate !py-2 text-center relative">
        <p className="max-w-[90%] !mx-auto truncate text-center">
          {building?.usage?.map((t, index) => (
            <span key={t}>
              {usageType(t).faName}
              {index < building?.usage?.length - 1 && " , "}
            </span>
          ))}
        </p>
        {showTrash && (
          <DeleteButton
            url={`/api/building/delete-building/${building.postalCode}`}
          />
        )}
      </td>
    </tr>
  );
});

export default BuildingListItem;
