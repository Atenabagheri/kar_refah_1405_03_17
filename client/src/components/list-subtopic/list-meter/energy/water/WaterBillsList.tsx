import { useEffect, useState } from "react";
import type {
  BuildingType,
  SiteType,
  WaterBillType,
} from "../../../../../types/types";
import { handleApiError } from "../../../../../utils/handleApiError";
import api from "../../../../../../api/axios";
import FilterBillDate from "./FilterBillDate";
import MyLineChart from "./chart/MyLineChart";
import WaterBillItem from "./WaterBillItem";
import { Link } from "react-router";

interface PropsType {
  // closeHandler: () => void;
  setTab: React.Dispatch<React.SetStateAction<string>>;
  // serialNumberSelect: string | null;
  billIdentifier: string | null;
  filterByDate: string;
  setFilterByDate: React.Dispatch<React.SetStateAction<string>>;
  setPayment: React.Dispatch<React.SetStateAction<string>>;
}

interface BillsDataType {
  year: string;
  bills: WaterBillType[];
}

type PlaceType = {
  site?: SiteType | null;
  building?: BuildingType | null;
};

const WaterBillsList = ({
  // serialNumberSelect,
  billIdentifier,
  setTab,
  filterByDate,
  setFilterByDate,
  setPayment,
}: PropsType) => {
  console.log(billIdentifier);
  const [billsData, setBillsData] = useState<BillsDataType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [place, setPlace] = useState<PlaceType>({ site: null, building: null });
  const [buildingsCover, setBuildingsCover] = useState<BuildingType[] | null>(
    null
  );

  const filterDate = filterByDate
    ? billsData?.find((b) => b?.year === filterByDate)
    : null;
  const dataList = billsData?.map((b) => ({ year: b?.year }));
  const lineChartData = filterDate
    ? filterDate?.bills?.map((bill) => ({
        name: bill?.period,
        value: bill?.totalPeriod,
        value2: bill?.averageThirtyDay,
      }))
    : [];
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await api.get(
          `/api/water-bill/get-date-water-bills/${billIdentifier}`
        );
        setBuildingsCover(res?.data?.buildingsCover);
        setPlace({ site: res?.data?.site, building: res?.data?.building });
        const sortData = res?.data?.result?.sort(
          (a: BillsDataType, b: BillsDataType) => +b?.year - +a?.year
        );
        // console.log(res?.data);;

        setBillsData(sortData);
        if (!filterByDate) setFilterByDate(sortData[0]?.year);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [billIdentifier, filterByDate, setFilterByDate]);

  const sorted = lineChartData?.sort((a, b) =>
    Number(b?.name?.slice(-2)) - Number(a?.name?.slice(-2)) ? -1 : 1
  );

  return loading ? (
    <div className="h-full w-full flex items-center justify-center">
      <span>درحال بارگذاری...</span>
    </div>
  ) : (
    <div className="!space-y-1 2xl:!space-y-4 !pt-2 2xl:!pt-5 !pr-3 h-full overflow-y-auto">
      {/* filter date */}
      <FilterBillDate
        label="تاریخ"
        data={dataList || []}
        selected={filterByDate}
        setSelected={setFilterByDate}
        isLoading={loading}
      />
      {/* table */}
      <div className="flex flex-col gap-4 w-[100%] overflow-x-auto !p-3 !mx-auto">
        <table className="w-full table-fixed text-xs xl:text-sm rounded-tr-xl rounded-tl-xl bg-secondary/5">
          <thead>
            <tr className="rounded-tr-xl rounded-tl-xl">
              <th className="bg-primary/25 w-[5%] !p-1 relative rounded-tr-xl">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  دوره
                </span>
              </th>
              <th className="bg-primary/25 w-[10%] !p-1 relative">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  قرائت پیشین
                </span>
              </th>
              <th className="bg-primary/25 w-[10%] !p-1 relative">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  قرائت جاری
                </span>
              </th>
              <th className="bg-primary/25 w-[10%] !p-1 relative">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  تعداد کل روز ها
                </span>
              </th>
              <th className="bg-primary/25 w-[15%] !p-1 relative">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  مصرف کل دوره (لیتر)
                </span>
              </th>
              <th className="bg-primary/25 w-[20%] !p-1 relative">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  متوسط مصرف 30 روز (لیتر)
                </span>
              </th>
              <th className="bg-primary/25 w-[15%] !p-1 relative">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  شناسه پرداخت
                </span>
              </th>
              <th className="bg-primary/25 w-[15%] !p-1 relative rounded-tl-xl">
                <span className={`font-normal text-sm  whitespace-nowrap`}>
                  مبلغ پرداختی (ریال)
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {!filterDate ? (
              <tr>
                <td colSpan={6}>
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
              filterDate?.bills?.map((bill) => (
                <WaterBillItem
                  key={bill?.paymentIdentifier}
                  bill={bill}
                  setTab={setTab}
                  setPayment={setPayment}
                />
              ))
            )}
          </tbody>
        </table>
        {/* نمودار مصرف برق */}
        {filterDate && <MyLineChart data={sorted} />}
        <div className="flex flex-nowrap items-center gap-2">
          <span className="text-neutral-600 text-sm">محل نصب کنتور</span>
          {place.building ? (
            <Link
              to={`/support/buildings/${place?.building?.postalCode}`}
              className="bg-primary/20 !p-1.5 text-sm rounded-lg border border-primary/50"
            >
              {place?.building?.name}
            </Link>
          ) : place.site ? (
            <span className="bg-primary/20 !p-1.5 text-sm rounded-lg border border-primary/50">
              {place?.site?.name}
            </span>
          ) : (
            <span className="text-neutral-800">نامشخص</span>
          )}
        </div>
        <div className="flex flex-nowrap items-center gap-2">
          <span className="text-neutral-600 text-sm">ساختمان های تحت پوشش</span>

          {buildingsCover && buildingsCover?.length > 0 ? (
            buildingsCover?.map((building) => (
              <Link
                key={building.postalCode}
                to={`/support/buildings/${building.postalCode}`}
                className="bg-primary/20 !p-1.5 text-sm rounded-lg border border-primary/50"
              >
                {building?.name}
              </Link>
            ))
          ) : (
            <p className="text-neutral-800">ساختمانی تحت پوشش نمی باشد.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaterBillsList;
