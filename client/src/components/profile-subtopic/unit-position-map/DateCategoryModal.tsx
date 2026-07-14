import { PiMagnifyingGlassBold, PiX } from "react-icons/pi";
import Modal from "../../../ui/Modal";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useEffect, useState } from "react";
import { fetchDateCategories } from "../../../redux/slices/subtopics/date-category/dateCategorySlice";
import { useNavigate } from "react-router";
import type { ProvinceType } from "../../../types/types";

type PropsType = {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  selectProvince: ProvinceType | null;
};

const DateCategoryModal = ({ setShow, selectProvince }: PropsType) => {
  const dispatch = useAppDispatch();
  const { dateCategoryList, loading } = useAppSelector(
    (state) => state.dateCategory
  );
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  useEffect(() => {
    if (dateCategoryList?.length > 0) {
      return;
    }
    dispatch(fetchDateCategories());
  }, [dispatch, dateCategoryList]);
  const searchData = search
    ? dateCategoryList?.filter((d) =>
        d?.title
          ?.toString()
          ?.toLocaleLowerCase()
          ?.includes(search?.toString()?.toLocaleLowerCase())
      )
    : dateCategoryList;
  return (
    <Modal>
      <div className="bg-white w-[400px] !p-4 !space-y-4 rounded-md">
        <div className="flex items-center justify-between w-full border-b border-secondary/50 !pb-2">
          <span className="text-sm font-semibold">تاریخ</span>
          <PiX className="cursor-pointer" onClick={() => setShow(false)} />
        </div>
        <div className="!space-y-2">
          {loading === "loadingList" ? (
            <span>در حال بارگذاری...</span>
          ) : (
            <div className="!space-y-2">
              <div className="relative">
                <input
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  type="search"
                  className="outline-1 outline-secondary/50 !p-1.5 text-xs rounded-md w-full placeholder:text-xs placeholder:text-gray-400 !pr-6"
                  placeholder="جستجو"
                />
                <button className="absolute top-1/2 -translate-y-1/2 right-2">
                  <PiMagnifyingGlassBold className="text-secondary/80" />
                </button>
              </div>
              {searchData?.length < 1 ? (
                <span>موردی یافت نشد.</span>
              ) : (
                <div className="max-h-[200px] overflow-y-auto !space-y-2">
                  {searchData?.map((d) => (
                    <div
                      onClick={() =>
                        navigate(`${d?.code}/${selectProvince?.name}`, {
                          state: selectProvince?.faName,
                        })
                      }
                      className="even:bg-secondary/20 cursor-pointer !p-1.5 rounded-md text-sm"
                      key={d?.code}
                    >
                      {d?.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DateCategoryModal;
