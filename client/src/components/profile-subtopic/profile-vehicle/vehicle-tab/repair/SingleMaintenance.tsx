import { useState } from "react";
import type { MaintenanceType } from "../../../../../types/types";
import ProfileInfo from "../../../../../ui/ProfileInfo";
import { convertDateToFa } from "../../../../../helper/convertDateToFa";
import { priceType } from "../../../../../helper/pricetype";

type PropsType = {
  maintenance: MaintenanceType;
};
const SingleMaintenance = ({ maintenance }: PropsType) => {
  const [showContent, setShowContent] = useState<boolean>(false);
  return (
    <div
      className="flex flex-col gap-2 w-full shadow-md rounded-lg overflow-hidden"
      onClick={() => setShowContent(!showContent)}
    >
      <div className="flex items-center justify-between bg-success/10 cursor-pointer !p-2">
        <ProfileInfo
          title="شماره سند مالی"
          value={maintenance?.financialDocumentNumber}
        />
        <ProfileInfo
          title="تاریخ تعمیر"
          value={convertDateToFa(maintenance?.repairDate)}
        />
      </div>
      {showContent && (
        <div className="flex flex-col gap-4 !p-2">
          <ProfileInfo title="نوع تعمیرات" value={maintenance?.repairType} />
          <ProfileInfo
            title="مشخصات تعمیرگاه"
            value={maintenance?.repairShop}
          />
          <ProfileInfo
            title="مبلغ پرداختی دستمزد"
            value={priceType(maintenance?.laborPayment) + " ریال"}
          />
          <ProfileInfo
            title="مبلغ پرداختی قطعات"
            value={priceType(maintenance?.partsPayment) + " ریال"}
          />
          {maintenance?.description && (
            <ProfileInfo title="توضیحات" value={maintenance?.description} />
          )}
        </div>
      )}
    </div>
  );
};

export default SingleMaintenance;
