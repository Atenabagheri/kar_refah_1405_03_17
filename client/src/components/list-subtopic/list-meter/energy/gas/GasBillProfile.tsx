import { useEffect, useState } from "react";
import type { ProfileGasBillType } from "../../../../../types/types";
import { handleApiError } from "../../../../../utils/handleApiError";
import api from "../../../../../../api/axios";
import { convertDateToFa } from "../../../../../helper/convertDateToFa";
import { convertDateToFaWithTime } from "../../../../../helper/convertDateToFaWithTime";
import { priceType } from "../../../../../helper/pricetype";

interface PropsType {
  payment: string;
}

const GasBillProfile = ({ payment }: PropsType) => {
  const [profileData, setProfileData] = useState<ProfileGasBillType | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!payment) return;
    const getData = async () => {
      try {
        const res = await api.get(
          `/api/gas-bill/get-gas-bill-with-payment-identifier/${payment}`
        );
        // console.log(res?.data);;
        setProfileData(res?.data);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [payment]);

  return loading ? (
    <div className="h-full w-full flex items-center justify-center">
      <span>در حال بارگذاری...</span>
    </div>
  ) : !profileData ? (
    <div className="text-center !pt5">
      <span>موردی یافت نشد.</span>
    </div>
  ) : (
    <div className="w-full h-full overflow-y-auto rounded-md !p-4 !space-y-4">
      <div className="flex flex-col gap-0 drop-shadow-md">
        <div className="flex items-center justify-between">
          <span className="!p-3 rounded-t-lg bg-danger/10 w-fit text-sm">
            اطلاعات کنتور
          </span>
          <div className="flex !space-x-2">
            <span className="text-sm text-neutral-700">قبض دوره:</span>
            <span className="text-neutral-950">{profileData?.period}</span>
          </div>
        </div>
        <div className="bg-danger/10 rounded-lg rounded-tr-none !p-3 w-full !space-y-4 text-neutral-700">
          <div className="flex items-center justify-between">
            <div className="!space-x-2">
              <span className="text-sm text-neutral-700">شناسه کنتور:</span>
              <span className="text-neutral-950">
                {profileData?.serialNumber.serialNumber}
              </span>
            </div>
            <div className="!space-x-2">
              <span className="text-sm text-neutral-700">شناسه قبض:</span>
              <span className="text-neutral-950">
                {profileData?.billIdentifier}
              </span>
            </div>
            <div className="!space-x-2">
              <span className="text-sm text-neutral-700">استان:</span>
              <span className="text-neutral-950">
                {profileData?.serialNumber.building.province?.faName}
              </span>
            </div>
            <div className="!space-x-2">
              <span className="text-sm text-neutral-700">شهرستان:</span>
              <span className="text-neutral-950">
                {profileData?.serialNumber.building.county?.faName}
              </span>
            </div>
            <div className="!space-x-2">
              <span className="text-sm text-neutral-700">شهر:</span>
              <span className="text-neutral-950">
                {profileData?.serialNumber.building.city?.faName}
              </span>
            </div>
          </div>
          <div className="!space-x-2">
            <span className="text-sm text-neutral-700">آدرس:</span>
            <span className="text-neutral-950">
              {profileData?.serialNumber.building.address}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-0 drop-shadow-md">
        <div className="flex items-center justify-between">
          <span className="!p-3 rounded-t-lg bg-danger/10 w-fit text-sm">
            اطلاعات مصرف
          </span>
        </div>
        <div className="bg-danger/10 rounded-lg rounded-tr-none !p-3 w-full !space-y-4 text-neutral-700">
          <div className="flex items-center justify-between">
            <div className="!space-x-2">
              <span className="text-sm text-neutral-700">
                تاریخ قرائت جاری:
              </span>
              <span className="text-neutral-950">
                {convertDateToFa(profileData?.currentReading)}
              </span>
            </div>
            <div className="!space-x-2">
              <span className="text-sm text-neutral-700">
                تاریخ قرائت پیشین:
              </span>
              <span className="text-neutral-950">
                {convertDateToFa(profileData?.previousReading)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="!space-x-2">
              <span className="text-sm text-neutral-700">
                تعداد روزهای مصرف:
              </span>
              <span className="text-neutral-950">{profileData?.totalDays}</span>
              <span className="text-sm text-neutral-700">روز</span>
            </div>
            <div className="!space-x-2">
              <span className="text-sm text-neutral-700">
                میزان مصرف کل دوره:
              </span>
              <span className="text-neutral-950">
                {profileData?.totalPeriod}
              </span>
              <span className="text-sm text-neutral-700">مترمکعب</span>
            </div>
            <div className="!space-x-2">
              <span className="text-sm text-neutral-700">
                میانگین مصرف 30 روز:
              </span>
              <span className="text-neutral-950">
                {profileData?.averageThirtyDay.toFixed(2)}
              </span>
              <span className="text-sm text-neutral-700">مترمکعب</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-0 drop-shadow-md">
        <div className="flex items-center justify-between">
          <span className="!p-3 rounded-t-lg bg-danger/10 w-fit text-sm">
            اطلاعات پرداخت
          </span>
        </div>
        <div className="bg-danger/10 rounded-lg rounded-tr-none !p-3 w-full !space-y-4 text-neutral-700">
          <div className="flex items-center justify-between">
            <div className="!space-x-2">
              <span className="text-sm text-neutral-700">شناسه پرداخت:</span>
              <span className="text-neutral-950">
                {profileData?.paymentIdentifier}
              </span>
            </div>
            <div className="!space-x-2">
              <span className="text-sm text-neutral-700">
                مبلغ قابل پرداخت:
              </span>
              <span className="text-neutral-950 font-bold">
                {priceType(profileData?.totalBillDebt)}
              </span>
              <span className="text-sm text-neutral-700">ریال</span>
            </div>
            <div className="!space-x-2">
              <span className="text-sm text-neutral-700">
                آخرین مهلت پرداخت:
              </span>
              <span className="text-neutral-950">
                {convertDateToFa(profileData?.paymentDeadLine)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 bg-neutral-200 rounded-md !p-1 text-xs w-fit absolute left-2 bottom-2">
        <div className="!space-x-2">
          <span className="text-neutral-700">ایجاد کننده:</span>
          {profileData?.creator ? (
            <span className="text-neutral-950">
              {profileData?.creator.firstName +
                " " +
                profileData?.creator.lastName}
            </span>
          ) : (
            <span className="text-neutral-950">نامشخص</span>
          )}
        </div>
        <div className="!space-x-2">
          <span className="text-neutral-700">آخرین ویرایش:</span>
          <span className="text-neutral-950">
            {convertDateToFaWithTime(profileData?.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GasBillProfile;
