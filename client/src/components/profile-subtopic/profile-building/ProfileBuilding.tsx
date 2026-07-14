import {
  PiBuildingApartmentDuotone,
  PiCaretLeft,
  PiCityDuotone,
  PiMapPinDuotone,
  PiNumberSquareNineDuotone,
  PiRulerDuotone,
  PiScrollDuotone,
  PiSignpostDuotone,
  PiSortAscending,
  PiSortDescending,
  PiStepsDuotone,
} from "react-icons/pi";
import type { BuildingType, ParamsType, RoomsType } from "../../../types/types";
import BuildingInfo from "./BuildingInfo";
import BuildingRooms from "./BuildingRooms";
import { useNavigate, useParams } from "react-router";
import BuildingGallery from "./building-gallery/BuildingGallery";
import { useCallback, useEffect, useState } from "react";
import api from "../../../../api/axios";
import { useAppSelector } from "../../../redux/hooks";
import axios from "axios";
import { usageType } from "../../list-subtopic/list-building/usageType";
import EnergyConsumption from "../../list-subtopic/list-meter/energy/EnergyConsumption";
import DeleteButton from "../../../ui/DeleteButton";

type UsageType = {
  name?: string;
  faName?: string | false;
  bgColor?: string;
};

const ProfileBuilding = () => {
  const { user, token } = useAppSelector((state) => state.auth);
  const { deleteId } = useAppSelector((state) => state.ui);
  const params = useParams<ParamsType>();
  const navigate = useNavigate();
  const id = params.id;

  const [data, setData] = useState<BuildingType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<number | string | undefined>(undefined);

  const [sortFloors, setSortFloors] = useState<"asc" | "desc">("asc");

  const sortHandler = () => {
    if (sortFloors === "asc") {
      setSortFloors("desc");
    } else if (sortFloors === "desc") {
      setSortFloors("asc");
    }
  };

  const getData = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get(
        `/api/building/get-building-with-postal-code/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // // console.log(res?.data);;
      setData(res?.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error?.response?.data.message);
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    getData();
  }, [getData, deleteId]);

  const rooms: RoomsType[] = data?.rooms || [];

  const groupedByFloor = rooms.reduce(
    (acc, item: RoomsType) => {
      if (!acc[item?.floor]) {
        acc[item?.floor] = [];
      }
      acc[item?.floor].push(item);
      return acc;
    },
    {} as Record<string, { floor: string; name: string; number: string }[]>,
  );

  let sortedFloor;

  if (sortFloors === "asc") {
    sortedFloor = Object.entries(groupedByFloor)
      .map((s) => s)
      .sort((a, b) => (Number(a[0]) > Number(b[0]) ? 1 : -1));
  } else if (sortFloors === "desc") {
    sortedFloor = Object.entries(groupedByFloor)
      .map((s) => s)
      .sort((a, b) => (Number(a[0]) > Number(b[0]) ? -1 : 1));
  }

  const usageList = data?.usage.map((t) => usageType(t));
  const ownerType =
    data?.ownership === "owner"
      ? "ملکی"
      : data?.ownership === "leased"
        ? "استیجاری"
        : data?.ownership === "other"
          ? "سایر"
          : "نامشخص";
  return loading ? (
    <div className="flex items-center justify-center h-full w-full">
      <p className="text-center !pt-10 text-secondary font-bold">
        در حال بارگذاری...
      </p>
    </div>
  ) : error ? (
    <div className="flex items-center justify-center h-full w-full relative">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 cursor-pointer absolute top-3 left-3"
      >
        <span>بازگشت</span>
        <PiCaretLeft />
      </button>
      <p className="text-center text-secondary font-bold">{error}</p>
    </div>
  ) : (
    <div className="flex gap-0 relative">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 cursor-pointer absolute top-3 left-3"
      >
        <span>بازگشت</span>
        <PiCaretLeft />
      </button>
      <div className="!space-y-4 !p-5 basis-2/3 h-full border-l border-secondary/20 min-h-[92vh]">
        <div className="flex gap-2 w-full">
          <div className="!space-y-4 basis-1/2 w-full">
            <div className="flex items-center gap-2">
              <div className="text-lg flex items-center !gap-4">
                <PiBuildingApartmentDuotone className="text-3xl" />
                <h3>
                  {data?.name?.startsWith("ساختمان")
                    ? data?.name
                    : `ساختمان ${data?.name}`}
                </h3>
              </div>
              {user?.isAdmin && (
                <DeleteButton
                  title={`ساختمان ${data?.name}`}
                  origin="profile"
                  url={`/api/building/delete-building/${data?.postalCode}`}
                />
              )}
            </div>

            <BuildingInfo
              title="سایت"
              icon={<PiCityDuotone className="text-2xl" />}
              value={data?.site?.name || "_"}
            />

            <BuildingInfo
              title="استان"
              icon={<PiMapPinDuotone className="text-2xl" />}
              value={data?.province?.faName}
            />
            <div className="border-r border-r-secondary/30 !pr-5 !mr-3 !space-y-4">
              <BuildingInfo
                title="شهرستان"
                // icon={<PiMapPinDuotone className="text-2xl" />}
                value={data?.county?.faName || "_"}
              />

              <BuildingInfo
                title="شهر"
                // icon={<PiMapPinDuotone className="text-2xl" />}
                value={data?.city?.faName || "_"}
              />

              <BuildingInfo
                title="آدرس"
                // icon={<PiMapPinDuotone className="text-2xl" />}
                value={data?.address}
              />
            </div>

            <BuildingInfo
              title="پلاک"
              icon={<PiNumberSquareNineDuotone className="text-2xl" />}
              value={data?.number || "_"}
            />

            <BuildingInfo
              title="کدپستی"
              icon={<PiSignpostDuotone className="text-2xl" />}
              value={data?.postalCode || "_"}
            />

            <BuildingInfo
              title="تعداد طبقات"
              icon={<PiStepsDuotone className="text-2xl" />}
              value={data?.floors || "نامشخص"}
            />

            <BuildingInfo
              title="نوع ملک"
              icon={<PiScrollDuotone className="text-2xl" />}
              value={ownerType}
            />

            <BuildingInfo
              title="عرصه"
              icon={<PiRulerDuotone className="text-2xl" />}
              value={data?.landArea ? data?.landArea + " متر" : "_"}
            />
            <BuildingInfo
              title="اعیان"
              icon={<PiRulerDuotone className="text-2xl" />}
              value={data?.builtArea ? data?.builtArea + " متر" : "_"}
            />
            <BuildingInfo
              title="متراژ هر طبقه"
              icon={<PiRulerDuotone className="text-2xl" />}
              value={data?.meterage ? data?.meterage + " متر" : "_"}
            />
          </div>
          <BuildingGallery image={data?.image} gallery={data?.gallery} />
        </div>
        {/* division */}
        <div className="!space-y-3 border-t border-secondary/20 !pt-3">
          {data?.division && (
            <div className="">
              <p className="">
                این ساختمان مطلق به {data?.division?.faName} است.
              </p>
            </div>
          )}
          {/* description */}
          <div className="flex flex-nowrap gap-2">
            <span className="text-dark/90">توضیحات:</span>
            <p className="">{data?.description}</p>
          </div>
          {/* type */}
          <div className="!space-x-2.5">
            <span className=" text-dark/90">نوع:</span>
            <span className="">
              {data?.type === "hqs" ? "ستاد(وزارتخانه)" : "استان"}
            </span>
          </div>
        </div>
        {/* usage */}
        <div className="flex items-center gap-3">
          <span className="text-dark/90">کاربری:</span>
          <div className="flex gap-3">
            {usageList?.map((e: UsageType) => (
              <div
                key={e.name}
                className={`w-[70px] ${e.bgColor} rounded-md text-sm !p-2 text-center`}
              >
                {e.faName}
              </div>
            ))}
          </div>
        </div>
        <EnergyConsumption data={data} />
      </div>

      {/* rooms */}
      <div className="flex flex-col gap-4 basis-1/3 !p-3">
        <div className="flex items-center gap-2">
          <h3 className="text-dark/90">اتاق‌ها</h3>
          <button
            onClick={sortHandler}
            className="text-xl bg-primary/10 !p-1 rounded-lg text-primary cursor-pointer"
          >
            {sortFloors === "desc" ? <PiSortAscending /> : <PiSortDescending />}
          </button>
        </div>
        <div className="overflow-hidden">
          <div className="!space-y-3 h-[80vh] overflow-y-auto">
            {rooms?.length < 1 ? (
              <span>فاقد طبقه</span>
            ) : (
              sortedFloor?.map(([floor, items]) => (
                <BuildingRooms key={floor} floor={floor} items={items} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBuilding;
