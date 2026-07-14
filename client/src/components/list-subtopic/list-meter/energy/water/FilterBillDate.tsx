import { useEffect, useRef, useState } from "react";
import { PiCaretDownBold, PiMagnifyingGlassBold } from "react-icons/pi";

interface DataType {
    year: string;
}

interface PropsType {
    data: DataType[];
    label: string;
    selected: string;
    setSelected: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
};


const FilterBillDate = ({
    label,
    data,
    selected,
    setSelected,
    isLoading = false,
}: PropsType) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setOpen]);

    const [search, setSearch] = useState("");
    // let searchData: DateCategoryType[] = [];
    let searchData: DataType[] = [];

    if (data) {
        searchData = search
            ? data?.filter(
                (d) =>
                    d?.year !== undefined &&
                    d?.year
                        ?.toString()
                        ?.toLocaleLowerCase()
                        ?.includes(search?.toString()?.toLocaleLowerCase())
            )
            : data;
    }

    return (
        <div
            ref={menuRef}
            className="flex flex-col gap-1.5 w-[200px] relative cursor-pointer"
        >
            <label className="text-sm text-dark">{label} :</label>
            {isLoading ? (
                <div className="w-full !p-1 h-9 rounded-md bg-secondary/50 animate-pulse"></div>
            ) : (
                <>
                    <div
                        onClick={() => {
                            setOpen(!open);
                        }}
                        className="cursor-pointer bg-white text-xs outline-1 outline-secondary/50 !p-1 rounded-md flex items-center justify-between"
                    >
                        {selected !== null && selected !== undefined ? (
                            <span className="text-sm">{selected}</span>
                        ) : (
                            <span className="text-sm text-dark/80">انتخاب کنید</span>
                        )}
                        <PiCaretDownBold className="" />
                    </div>
                    {
                        <div
                            className={
                                open
                                    ? "rounded-md shadow-[0_0_5px_#00000050] w-full flex flex-col gap-3 !py-3 absolute left-0 right-0 top-[76px] bg-white z-[20] -translate-y-3"
                                    : "hidden"
                            }
                        >
                            <div className="relative w-[92%] !mx-auto">
                                <input
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                    }}
                                    type="search"
                                    className="outline-1 outline-secondary/50 !p-2 text-xs rounded-md w-full placeholder:text-xs placeholder:text-caspian-gray !pr-6"
                                    placeholder="جستجو"
                                />
                                <button className="absolute top-1/2 -translate-y-1/2 right-1">
                                    <PiMagnifyingGlassBold className="text-secondary/80" />
                                </button>
                            </div>
                            <div className="flex flex-col gap-2 w-full max-h-[150px] overflow-y-auto">
                                {searchData?.length > 0 ? (
                                    searchData.map((m, i: number) => (
                                        <div
                                            key={i}
                                            onClick={() => {
                                                setSelected(m?.year);
                                                setSearch("");
                                                setOpen(false);
                                            }}
                                            className="flex items-center justify-start gap-2 text-xs hover:bg-light !py-1 !px-2 w-full cursor-pointer duration-300"
                                        >
                                            <span className="text-sm">{m?.year}</span>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-sm !py-1 !px-2">موردی یافت نشد</span>
                                )}
                            </div>
                        </div>
                    }
                </>
            )}
        </div>
    );
};

export default FilterBillDate;
