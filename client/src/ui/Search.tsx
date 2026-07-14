import { useQuery } from "../hooks/useQuery";
import type React from "react";
import { useEffect, useState } from "react";
import { PiMagnifyingGlassDuotone, PiX } from "react-icons/pi";

type PropsType = {
  placeholder?: string | undefined;
};
const Search = ({ placeholder }: PropsType) => {
  const { get, update } = useQuery();
  const s = get("search");
  const [search, setSearch] = useState(s || "");

  const searchHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!search) return;
    update({ search: search, page: "1" });
  };

  const searchClose = () => {
    setSearch("");
    update({ search: null, page: "1" });
  };

  useEffect(() => {
    setSearch(s || "");
  }, [s]);

  return (
    <form
      onSubmit={searchHandler}
      className="flex items-center gap-1 text-sm relative w-full md:w-1/3"
    >
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="!p-2 rounded-lg bg-dark/5 shadow-md outline-none w-full !pr-10"
        placeholder={placeholder}
      />
      <button
        type="button"
        className="absolute top-1/2 -translate-y-1/2 right-2 text-2xl text-dark/80"
      >
        <PiMagnifyingGlassDuotone />
      </button>
      {(s || search.length > 0) && (
        <button
          onClick={searchClose}
          type="button"
          className="absolute top-1/2 -translate-y-1/2 left-2 text-2xl text-dark/30 cursor-pointer"
        >
          <PiX />
        </button>
      )}
    </form>
  );
};

export default Search;
