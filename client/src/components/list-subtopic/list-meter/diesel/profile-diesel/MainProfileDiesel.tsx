import { PiX } from "react-icons/pi";
import Modal from "../../../../../ui/Modal";
import type { DieselType } from "../../../../../types/types";
import { useCallback, useEffect, useState } from "react";
import api from "../../../../../../api/axios";
import { convertDateToFa } from "../../../../../helper/convertDateToFa";
import { priceType } from "../../../../../helper/pricetype";
import DeleteButton from "../../../../../ui/DeleteButton";
import { useAppSelector } from "../../../../../redux/hooks";

type PropsType = {
  closeHandler: () => void;
  documentNumberSelect: string | null;
};
const MainProfileDiesel = ({
  closeHandler,
  documentNumberSelect,
}: PropsType) => {
  const { user } = useAppSelector((state) => state.auth);
  const [data, setData] = useState<DieselType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const getData = useCallback(async () => {
    if (!documentNumberSelect) return;
    try {
      const res = await api.get(
        `/api/diesel/get-diesel-with-document-number/${documentNumberSelect}`,
      );
      // console.log(res?.data);;
      setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [documentNumberSelect]);

  useEffect(() => {
    getData();
  }, [getData]);

  const place = data?.building ? data?.building : data?.site;
  return (
    <Modal className="w-[80%]">
      {loading ? (
        <div>loading...</div>
      ) : (
        <div className="bg-white w-full rounded-md h-[80vh] flex flex-col gap-0 overflow-hidden">
          <div className="flex items-center justify-between gap-1 !p-4 border-b border-b-neutral-200">
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-600">
                اطلاعات فاکتور {documentNumberSelect}
              </span>

              {user?.isAdmin && (
                <DeleteButton
                  title={`فاکتور ${data?.documentNumber}`}
                  origin="profile"
                  url={`/api/diesel/delete-diesel/${data?.documentNumber}`}
                />
              )}
            </div>

            <button
              onClick={closeHandler}
              className="cursor-pointer text-neutral-600 text-xl"
            >
              <PiX />
            </button>
          </div>
          <div className="w-full h-full overflow-y-auto">
            <div className="!p-4 border-b border-b-neutral-100">
              <div className="flex items-center gap-2">
                <span className="text-neutral-600">تاریخ خرید</span>
                <span>
                  {data?.purchaseDate
                    ? convertDateToFa(data?.purchaseDate)
                    : "-"}
                </span>
              </div>
            </div>

            <div className="!p-4 border-b border-b-neutral-100">
              <div className="flex items-center gap-2">
                <span className="text-neutral-600">شماره نیاز</span>
                <div>{data?.documentNumber}</div>
              </div>
            </div>

            <div className="!p-4 border-b border-b-neutral-100">
              <div className="flex items-center gap-2">
                <span className="text-neutral-600">محل تخلیه</span>
                {place ? (
                  <div className="flex items-center gap-2">
                    <span>{place.name}</span>
                    <span className="bg-secondary/20 rounded-md text-sm !p-1">
                      {place.address}
                    </span>
                  </div>
                ) : (
                  "-"
                )}
              </div>
            </div>

            <div className="!p-4 border-b border-b-neutral-100">
              <div className="flex items-center gap-2">
                <span className="text-neutral-600">میزان خرید</span>
                <span>{data?.quantity + " لیتر" || "-"}</span>
              </div>
            </div>

            <div className="!p-4 border-b border-b-neutral-100">
              <div className="flex items-center gap-2">
                <span className="text-neutral-600">مبلغ خرید</span>
                <span>
                  {data?.amount ? priceType(+data?.amount) : "-"} ریال
                </span>
              </div>
            </div>

            {/* <div className="!p-4 border-b border-b-neutral-100">
              <div className="flex items-center gap-2">
                <span className="text-neutral-600">خریدار</span>
                <span>
                  {data?.buyer?.firstName + " " + data?.buyer?.lastName || "-"}
                </span>
              </div>
            </div> */}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default MainProfileDiesel;
