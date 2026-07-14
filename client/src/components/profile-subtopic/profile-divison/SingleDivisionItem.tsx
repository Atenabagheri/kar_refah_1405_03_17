import type { HeadquarterType } from "../../../types/types";

interface PropsType {
    item: HeadquarterType;
    row: number;
}

const SingleDivisionItem = ({ item, row }: PropsType) => {
    return (
        <tr
            className="border-b border-secondary/20 text-xs 2xl:text-sm border-b-caspian-gray2 whitespace-nowrap"
        //   onClick={navigateHandler}
        >
            <td
                className="w-[5%] whitespace-nowrap !py-2 text-center"
            >
                <p className="text-center">
                    {row}
                </p>
            </td>
            <td
                className="w-[20%] whitespace-nowrap !py-2 text-center"
                title={item?.sectionCode?.faName}
            >
                <p className="max-w-[90%] !mx-auto truncate text-center">
                    {item?.sectionCode?.faName}
                </p>
            </td>
            <td className="w-[15%] whitespace-nowrap truncate !py-2 text-center">
                {item?.sectionCenter + item?.sectionGeneral + item?.sectionOffice + item?.sectionManagement}
            </td>
            <td
                className="w-[10%] whitespace-nowrap !py-2 text-center"
            >
                {item?.sectionDeputy}
            </td>
            <td
                className="w-[10%] whitespace-nowrap !py-2 text-center"
            >
                {item?.sectionCenter}
            </td>
            <td
                className="w-[10%] whitespace-nowrap !py-2 text-center"
            >
                {item?.sectionGeneral}
            </td>

            <td
                className="w-[10%] whitespace-nowrap !py-2 text-center"
            >
                {item?.sectionOffice}
            </td>

            <td
                className="w-[10%] whitespace-nowrap truncate !py-2 text-center"
            >
                {item?.sectionManagement}
            </td>

            <td
                className="w-[10%] whitespace-nowrap truncate !py-2 text-center"
            >
                {item?.sectionDepartment}
            </td>
        </tr>
    )
}

export default SingleDivisionItem