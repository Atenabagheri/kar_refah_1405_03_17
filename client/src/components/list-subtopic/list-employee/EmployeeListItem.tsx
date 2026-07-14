import { useNavigate, useParams } from "react-router";
import type { EmployeeType, ParamsType } from "../../../types/types";
import DeleteButton from "../../../ui/DeleteButton";

interface PropsType {
  employee: EmployeeType;
  row: number;
}

const EmployeeListItem = ({ employee, row }: PropsType) => {
  const navigate = useNavigate();
  const { topic, subtopic } = useParams<ParamsType>();

  const navigateHandler = () => {
    navigate(`/${topic}/${subtopic}/${employee?.nationalId}`);
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
        <p className="max-w-[90%] !mx-auto truncate text-center">{row}</p>
      </td>

      <td
        className="w-[15%] whitespace-nowrap !py-2 text-center"
        title={employee?.firstName}
      >
        <p className="max-w-[90%] !mx-auto truncate text-center">
          {employee?.firstName}
        </p>
      </td>

      <td
        className="w-[15%] whitespace-nowrap !py-2 text-center"
        title={employee?.lastName}
      >
        <p className="max-w-[90%] !mx-auto truncate text-center">
          {employee?.lastName}
        </p>
      </td>

      <td
        className="w-[20%] whitespace-nowrap truncate !py-2 text-center"
        title={employee?.nationalId}
      >
        <p className="max-w-[90%] !mx-auto truncate text-center">
          {employee?.nationalId}
        </p>
      </td>

      <td
        className="w-[15%] whitespace-nowrap truncate !py-2 text-center"
        title={employee?.phone}
      >
        <p className="max-w-[90%] !mx-auto truncate text-center">
          {employee?.phone}
        </p>
      </td>

      <td
        className="w-[20%] whitespace-nowrap truncate !py-2 text-center relative"
        title={employee?.positionCode?.title}
      >
        <p className="max-w-[90%] !mx-auto truncate text-center">
          {employee?.positionCode?.title}
        </p>

        <DeleteButton
          className={showTrash ? "" : "hidden"}
          title={`کاربر ${(employee?.firstName || "-") + " " + (employee?.lastName || "-")}`}
          url={`/api/employee/delete-employee/${employee.nationalId}`}
        />
      </td>
    </tr>
  );
};

export default EmployeeListItem;
