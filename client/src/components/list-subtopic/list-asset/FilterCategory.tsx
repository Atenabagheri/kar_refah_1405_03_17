import { useEffect, useRef, useState } from "react";
import api from "../../../../api/axios";
import { PiCaretDownBold, PiMagnifyingGlassBold } from "react-icons/pi";
import { useQuery } from "../../../hooks/useQuery";

interface DataType {
  code: string;
  name: string;
}

interface PropsType {
  label: string;
  url: string;
}

const FilterCategory = ({ label, url }: PropsType) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const { get, update } = useQuery();
  const category = get("category");

  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<null | DataType>(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!loading) return;
    const getData = async () => {
      try {
        const res = await api.get(url);
        // console.log(res?.data);;
        setData(res?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [loading, url]);

  let searchData: DataType[] = [];

  if (!loading) {
    searchData = search
      ? data?.filter((d) =>
          d?.name
            ?.toString()
            ?.toLocaleLowerCase()
            ?.includes(search?.toString()?.toLocaleLowerCase())
        )
      : data;
  }

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

  const getCategory = (cat: DataType | null) => {
    if (cat?.code) {
      setSearch("");
      setOpen(false);
      update({ page: "1", category: cat.code });
      setSelected(cat);
    } else {
      setSearch("");
      setOpen(false);
      update({ page: "1", category: "" });
      setSelected(null);
    }
  };
  return (
    <div
      ref={menuRef}
      className="flex items-center gap-1.5 relative cursor-pointer"
    >
      <label className="text-sm text-dark">{label} :</label>
      <div
        onClick={() => setOpen(!open)}
        className={`w-[180px] cursor-pointer bg-light shadow-md !p-2 rounded-lg flex items-center justify-between`}
      >
        {selected !== null && selected !== undefined ? (
          <span className="text-sm">{selected?.name}</span>
        ) : (
          <span className="text-sm">همه</span>
        )}
        <PiCaretDownBold />
      </div>
      {
        <div
          className={
            open
              ? "rounded-md shadow-[0_0_5px_#00000050] w-[180px] flex flex-col gap-3 absolute left-0 top-10 bg-white z-[999] !pt-2 overflow-hidden"
              : "hidden"
          }
        >
          <div className="relative w-[92%] !mx-auto">
            <input
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              value={search}
              type="search"
              className="outline-1 outline-secondary/50 !p-2 text-xs rounded-md w-full placeholder:text-xs placeholder:text-caspian-gray !pr-6"
              placeholder="جستجو"
            />
            <button className="absolute top-1/2 -translate-y-1/2 right-1">
              <PiMagnifyingGlassBold className="text-secondary/80" />
            </button>
          </div>
          <div className="flex flex-col gap-2 w-full max-h-[180px] overflow-y-auto">
            {loading ? (
              <p className="text-xs p-2">در حال بارگذاری...</p>
            ) : (
              <div className="flex flex-col gap-0">
                {!search && (
                  <div
                    onClick={() => category && getCategory(null)}
                    className="flex items-center justify-start gap-2 text-sm hover:bg-dark/10 !p-2 w-full cursor-pointer duration-300"
                  >
                    همه
                  </div>
                )}
                {searchData?.length > 0 ? (
                  searchData.map((m, i: number) => (
                    <div
                      key={i}
                      onClick={() =>
                        (!category || category !== m.code) && getCategory(m)
                      }
                      className="flex items-center justify-start gap-2 text-sm hover:bg-dark/10 !p-2 w-full cursor-pointer duration-300"
                    >
                      <span className="text-sm">{m?.name}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs 2xl:text-sm !p-2">
                    موردی یافت نشد
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      }
    </div>
  );
};

export default FilterCategory;
