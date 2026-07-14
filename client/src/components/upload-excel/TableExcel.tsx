import { PiX } from "react-icons/pi";
import type { EmployeeType } from "../../types/types";
import Modal from "../../ui/Modal";

type Props = {
  jsonData: EmployeeType[];
  closeTable: () => void;
};
const TableExcel = ({ jsonData, closeTable }: Props) => {
  const keys = Object.keys(jsonData[0]);

  return (
    <Modal className="w-[90%] overflow-hidden rounded-md relative">
      <div className="bg-white w-full">
        <div className="w-full !p-2 flex justify-end">
          <button onClick={closeTable} className="cursor-pointer">
            <PiX />
          </button>
        </div>
        <div className="h-[90vh] !p-2 overflow-auto">
          <table className="max-w-[1200px] w-full border border-collapse">
            <thead className="">
              <tr className="border-b border-b-neutral-300">
                {keys?.map((k) => (
                  <th
                    key={k}
                    className="border border-collapse !p-1 text-center text-sm"
                  >
                    {k}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jsonData?.map((e, i) => (
                <tr key={i}>
                  {Object?.values(e)?.map((v, j) => (
                    <td
                      className="w-fit border border-collapse border-neutral-500 !p-1 text-center text-sm"
                      key={j}
                    >
                      <span className="w-full line-clamp-2" title={v}>{v}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};

export default TableExcel;
