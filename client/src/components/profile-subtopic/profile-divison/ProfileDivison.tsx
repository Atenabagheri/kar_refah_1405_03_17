import type {
  HeadquarterSectionsType,
  HeadquarterType,
} from "../../../types/types";
import { PiCircleNotch } from "react-icons/pi";
import SingleDivisionItem from "./SingleDivisionItem";
import TotalSections from "./TotalSections";
import MainChart from "./chart/MainChart";
interface PropsType {
  data: HeadquarterType[];
  total: HeadquarterSectionsType;
  loading: boolean;
}

const ProfileDivison = ({ data, loading, total }: PropsType) => {
  return (
    <div className="!space-y-8 !px-3 xl:!px-8 !pt-5">
      <div className="w-full overflow-x-auto overflow-y-hidden">
        <table className="min-w-[1200px] w-full table-fixed text-xs xl:text-sm rounded-tr-xl rounded-tl-xl bg-secondary/5">
          <thead className="h-[60px]">
            <tr className="rounded-tr-xl rounded-tl-xl">
              <th className="bg-primary/25 w-[5%] !p-1 relative rounded-tr-xl">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  ردیف
                </span>
              </th>
              <th className="bg-primary/25 w-[20%] !p-1 relative">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  عنوان
                </span>
              </th>
              <th className="bg-primary/25 w-[15%] !p-1 relative">
                <span className={`font-normal text-sm`}>
                  جمع
                  <br />
                  (مرکز/اداره کل/دفتر/مدیریت)
                </span>
              </th>
              <th className="bg-primary/25 w-[10%] !p-1 relative">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  معاونت
                </span>
              </th>
              <th className="bg-primary/25 w-[10%] !p-1 relative">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  مرکز
                </span>
              </th>
              <th className="bg-primary/25 w-[10%] !p-1 relative">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  اداره کل
                </span>
              </th>
              <th className="bg-primary/25 w-[10%] !p-1 relative">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  دفتر
                </span>
              </th>
              <th className="bg-primary/25 w-[10%] !p-1 relative">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  مدیریت
                </span>
              </th>
              <th className="bg-primary/25 w-[10%] !p-1 relative rounded-tl-xl">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  اداره/گروه
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9}>
                  <div className="h-[250px] w-full flex items-center justify-center bg-white">
                    <PiCircleNotch className="animate-spin text-4xl text-primary" />
                  </div>
                </td>
              </tr>
            ) : data?.length < 1 ? (
              <tr>
                <td colSpan={9}>
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
              data?.map((item: HeadquarterType, index) => (
                <SingleDivisionItem
                  item={item}
                  key={index}
                  row={data?.indexOf(item) + 1}
                />
              ))
            )}
          </tbody>
        </table>
        {data?.length > 0 && <TotalSections total={total} />}
      </div>
      {/* pie chart */}
      {data?.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-dark/80">نمودار</span>
          <MainChart total={total} />
        </div>
      )}
    </div>
  );
};

export default ProfileDivison;
