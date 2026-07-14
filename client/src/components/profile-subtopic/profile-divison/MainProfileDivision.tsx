import { useEffect, useState } from "react";
import type {
  HeadquarterSectionsType,
  HeadquarterType,
} from "../../../types/types";
import { handleApiError } from "../../../utils/handleApiError";
import api from "../../../../api/axios";
import { useNavigate, useParams } from "react-router";
import ProfileDivison from "./ProfileDivison";
import { convertNumberToMonth } from "../../../helper/convertNumberToMonth";
import { PiCaretLeft } from "react-icons/pi";

interface DataType {
  data: HeadquarterType[];
  total: HeadquarterSectionsType;
  division: string;
}

const MainProfileDivision = () => {
  const navigate = useNavigate();
  const { dateCategory, name } = useParams();
  const [divisionData, setDivisionData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const year = dateCategory && dateCategory?.slice(0, 4);
  const monthNumber = dateCategory && dateCategory?.slice(-2);
  useEffect(() => {
    if (!dateCategory || !name) return;
    const getData = async () => {
      try {
        const res = await api.get(
          `/api/section-headquarter/get-section-headquarters-with-division/${dateCategory}/${name}`
        );
        // console.log(res?.data);;
        setDivisionData(res?.data);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [dateCategory, name]);
  return !divisionData && loading ? (
    <p className="text-center !pt-10 text-secondary font-bold">
      در حال بارگذاری...
    </p>
  ) : divisionData === null ? (
    <p className="text-center !pt-10 text-secondary font-bold">
      موردی یافت نشد.
    </p>
  ) : (
    <div className="!space-y-4">
      <div className="flex items-center justify-between !px-3 xl:!px-8 !pt-4">
        <h3 className="font-semibold text-dark/80">
          لیست اطلاعات {divisionData?.division} به تاریخ{" "}
          {convertNumberToMonth(Number(monthNumber))} {year}
        </h3>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 cursor-pointer"
        >
          <span>بازگشت</span>
          <PiCaretLeft />
        </button>
      </div>
      <ProfileDivison
        data={divisionData?.data}
        total={divisionData?.total}
        loading={loading}
      />
    </div>
  );
};

export default MainProfileDivision;
