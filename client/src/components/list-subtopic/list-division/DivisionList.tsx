import { useState } from "react";
import type { DivisionType } from "../../../types/types"
import { PiCircleNotch } from "react-icons/pi";
import DivisionListItem from "./DivisionListItem";
import DateCategorySelect from "./DateCategorySelect";

interface PropsType {
    data: DivisionType[];
    loading: boolean;
}

const DivisionList = ({ data, loading }: PropsType) => {

    const [show, setShow] = useState<boolean>(false);
    const [selectDivision, setSelectDivision] = useState<string>("");

    const [paramState, setParamState] = useState({
        faName: "",
        code: "",
    });
    return (
        <div className="!space-y-4 !p-3 !pr-50 xl:!pr-20 2xl:!mr-0 2xl:!px-8 w-full">
            {show && selectDivision && <DateCategorySelect setShow={setShow} selectDivision={selectDivision} />}
            <div className="w-full overflow-x-auto">
                <table className="min-w-[800px] w-[800px] !mx-auto table-fixed text-xs xl:text-sm rounded-tr-xl rounded-tl-xl bg-secondary/5">
                    <thead>
                        <tr className="rounded-tr-xl rounded-tl-xl">
                            <th className="bg-primary/25 w-[20%] !p-1 relative rounded-tr-xl">
                                <span
                                    className={`font-normal text-sm  whitespace-nowrap`}
                                >
                                    ردیف
                                </span>
                            </th>
                            <th className="bg-primary/25 w-[60%] !p-1 relative">
                                <input
                                    id="t1"
                                    type="text"
                                    name="faName"
                                    disabled
                                    className={`${paramState?.faName ? "outline-white/50 border" : ""} peer text-darkyellow-300 border-none outline-none focus:outline-white/50 cursor-pointer bg-primary-500 text-sm w-full font-normal rounded-md !p-1.5 !pr-8 border border-gray2`}
                                    onChange={(e) => {
                                        setParamState({
                                            ...paramState,
                                            [e.target.name]: e.target.value,
                                        });
                                    }}
                                />
                                <label
                                    htmlFor="t1"
                                    className={`${paramState?.faName ? "left-full right-3" : ""} absolute cursor-pointer font-normal text-sm top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 peer-focus:left-full  whitespace-nowrap peer-focus:right-3`}
                                >
                                    عنوان
                                </label>
                            </th>
                            <th className="bg-primary/25 w-[20%] !p-1 relative rounded-tl-xl">
                                <input
                                    id="t2"
                                    type="text"
                                    name="code"
                                    disabled
                                    className={`${paramState?.code ? "outline-white/50 border" : ""} peer text-darkyellow-300 border-none outline-none focus:outline-white/50 cursor-pointer bg-primary-500 text-sm w-full font-normal rounded-md !p-1.5 !pr-16 border border-gray2`}
                                    onChange={(e) => {
                                        setParamState({
                                            ...paramState,
                                            [e.target.name]: e.target.value,
                                        });
                                    }}
                                />
                                <label
                                    htmlFor="t2"
                                    className={`${paramState?.code ? "left-full right-3" : ""} absolute cursor-pointer font-normal text-sm top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 peer-focus:left-full  whitespace-nowrap peer-focus:right-3`}
                                >
                                    کد
                                </label>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={3}>
                                    <div className="h-[250px] w-full flex items-center justify-center bg-white">
                                        <PiCircleNotch className="animate-spin text-4xl text-primary" />
                                    </div>
                                </td>
                            </tr>
                        ) : data?.length < 1 ? (
                            <tr>
                                <td colSpan={3}>
                                    <div className="py-5 flex flex-col gap-3 items-center justify-center">
                                        <div className="w-[220px] h-[220px] flex justify-center">
                                            <img
                                                src="/assets/images/not-found.svg"
                                                alt="موردی یافت نشد..."
                                            />
                                        </div>
                                        <h2 className="text-center text-sm"> موردی یافت نشد...</h2>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data?.map((division: DivisionType) => (
                                <DivisionListItem
                                    division={division}
                                    key={division?.code}
                                    row={data?.indexOf(division) + 1}
                                    setShow={setShow}
                                    setSelectDivision={setSelectDivision}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DivisionList