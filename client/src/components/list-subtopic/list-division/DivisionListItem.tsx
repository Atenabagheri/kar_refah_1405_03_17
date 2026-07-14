import type { DivisionType } from '../../../types/types';

interface PropsType {
    division: DivisionType;
    row: number;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectDivision: React.Dispatch<React.SetStateAction<string>>;
}

const DivisionListItem = ({ division, row, setShow, setSelectDivision }: PropsType) => {
    const handleClick = (code: string) => {
        setSelectDivision(code);
        setShow(true);
    };
    return (
        <tr
            className="cursor-pointer border-b border-secondary/20 text-xs 2xl:text-sm border-b-caspian-gray2 whitespace-nowrap"
            onClick={() => handleClick(division?.code)}
        >
            <td
                className="w-[20%] whitespace-nowrap !py-2 text-center"
            >
                <p className="text-center">
                    {row}
                </p>
            </td>
            <td
                className="w-[70%] whitespace-nowrap !py-2 text-center"
                title={division?.faName}
            >
                <p className="max-w-[90%] !mx-auto truncate text-center">
                    {division?.faName}
                </p>
            </td>
            <td
                className="w-[20%] whitespace-nowrap !py-2 text-center"
                title={division?.code}
            >
                <p className="max-w-[90%] !mx-auto truncate text-center">
                    {division?.code}
                </p>
            </td>
        </tr>
    )
}

export default DivisionListItem