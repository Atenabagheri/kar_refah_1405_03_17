import { useSearchParams } from "react-router";
import MeterTab from "./MeterTab";
import MainElectricity from "./electricity/MainElectricity";
import MainWater from "./water/MainWater";
import NotFound from "../../../pages/NotFound";
import MainGas from "./gas/MainGas";
import MainGreen from "./green/MainGreen";
import MainDiesel from "./diesel/MainDiesel";
import TemplateDownload from "../../../ui/TemplateDownload";
import { useAppSelector } from "../../../redux/hooks";
import MainUploadExcel from "../../upload-excel/MainUploadExcel";

const MainMeterList = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const meter: string | null = searchParams.get("meter");
  return (
    <div className="!space-y-2 !pb-8">
      <MeterTab />
      {meter === "electricity" || meter === null ? (
        <>
          <MainElectricity />
          {user?.isAdmin && (
            <div className="flex flex-col gap-4 !px-2">
              <div className="flex items-center gap-1 !px-2">
                <MainUploadExcel
                  url="/api/electricity-meter/upload"
                  fileName="electricityMeter"
                  title="بارگزاری کنتور برق"
                />
                <MainUploadExcel
                  url="/api/electricity-bill/upload"
                  fileName="electricityBill"
                  title="بارگزاری قبض برق"
                />
              </div>
              <div className="flex items-center gap-1 !px-2">
                <TemplateDownload
                  title="کنتور برق"
                  fileName="electricityMeter.xlsx"
                />
                <TemplateDownload
                  title="قبض برق"
                  fileName="electricityBill.xlsx"
                />
              </div>
            </div>
          )}
        </>
      ) : meter === "water" ? (
        <>
          <MainWater />
          {user?.isAdmin && (
            <div className="flex flex-col gap-4 !px-2">
              <div className="flex items-center gap-1 !px-2">
                <MainUploadExcel
                  url="/api/water-meter/upload"
                  fileName="waterMeter"
                  title="بارگزاری کنتور آب"
                />
                <MainUploadExcel
                  url="/api/water-bill/upload"
                  fileName="waterBill"
                  title="بارگزاری قبض آب"
                />
              </div>
              <div className="flex items-center gap-1 !px-2">
                <TemplateDownload title="کنتور آب" fileName="waterMeter.xlsx" />
                <TemplateDownload title="قبض آب" fileName="waterBill.xlsx" />
              </div>
            </div>
          )}
        </>
      ) : meter === "gas" ? (
        <>
          <MainGas />
          {user?.isAdmin && (
            <div className="flex flex-col gap-4 !px-2">
              <div className="flex items-center gap-1 !px-2">
                <MainUploadExcel
                  url="/api/gas-meter/upload"
                  fileName="gasMeter"
                  title="بارگزاری کنتور گاز"
                />
                <MainUploadExcel
                  url="/api/gas-bill/upload"
                  fileName="gasBill"
                  title="بارگزاری قبض گاز"
                />
              </div>
              <div className="flex items-center gap-1 !px-2">
                <TemplateDownload title="کنتور گاز" fileName="gasMeter.xlsx" />
                <TemplateDownload title="قبض گاز" fileName="gasBill.xlsx" />
              </div>
            </div>
          )}
        </>
      ) : meter === "green" ? (
        <MainGreen />
      ) : meter === "diesel" ? (
        <>
          <MainDiesel />
          {user?.isAdmin && (
            <div className="flex flex-col items-start gap-4 !px-2 w-full">
              <MainUploadExcel
                url="/api/diesel/upload"
                fileName="diesel"
                title="بارگزاری فاکتور گازوئیل"
              />
              <TemplateDownload title="فاکتور گازوئیل" fileName="diesel.xlsx" />
            </div>
          )}
        </>
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default MainMeterList;
