import { useState } from "react";
import type { InsuranceType } from "../../../../../types/types";
import ProfileInfo from "../../../../../ui/ProfileInfo";
import { convertDateToFa } from "../../../../../helper/convertDateToFa";
import api from "../../../../../../api/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Modal from "../../../../../ui/Modal";
import MainGallery from "../../../../../ui/gallery/MainGallery";
import { PiTrashSimple, PiX } from "react-icons/pi";
import DeleteComponent from "../../DeleteComponent";
import { useAppSelector } from "../../../../../redux/hooks";

type PropsType = {
  insurance: InsuranceType;
};
const SingleInsurance = ({ insurance }: PropsType) => {
  const { user } = useAppSelector((state) => state.auth);
  const [showContent, setShowContent] = useState<boolean>(false);

  const url = api?.defaults.baseURL;

  const [showModal, setShowModal] = useState<number | null>(null);
  const [showModalDelete, setShowModalDelete] = useState<string | null>(null);

  const deleteHandler = (insuranceCode: string) => {
    // if (!insuranceCode) return;
    setShowModalDelete(insuranceCode);
  };

  return user?.isAdmin && showModalDelete ? (
    <Modal className="min-w-[360px] bg-white rounded-xl !p-4 z-9999">
      <DeleteComponent
        showModal={showModalDelete}
        setShowModal={setShowModalDelete}
        url={`/api/insurance/delete-insurance/${insurance?.insuranceCode}`}
      />
    </Modal>
  ) : (
    <div className="flex flex-col gap-2 w-full shadow-md rounded-lg overflow-hidden">
      <div
        onClick={() => setShowContent(!showContent)}
        className="flex items-center justify-between bg-warning/20 cursor-pointer !p-2 relative"
      >
        <ProfileInfo
          title="کد یکتا بیمه نامه"
          value={insurance?.insuranceCode}
        />

        {user?.isAdmin && (
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              e.stopPropagation();
              deleteHandler(insurance?.insuranceCode as string);
            }}
            className="hover:bg-danger/20 rounded-md !p-1 cursor-pointer absolute left-2 top-1/2 -translate-y-1/2"
          >
            <PiTrashSimple className="text-xl text-danger" />
          </button>
        )}

        {/* <DeleteButton
          title={`بیمه نامه با کد یکتا ${insurance.insuranceCode}`}
          url={`/api/insurance/delete-insurance/${insurance.insuranceCode}`}
        /> */}
      </div>
      {showContent && (
        <div className="flex flex-col gap-4 !p-2">
          <div className="flex items-center justify-between border-b border-b-dark/10 !pb-2">
            <ProfileInfo
              title="شماره بیمه شخص ثالث"
              value={insurance?.thirdPartyNumber}
              fontSize={14}
            />
            <ProfileInfo
              title="تاریخ اعتبار"
              value={convertDateToFa(insurance?.thirdPartyExpire)}
              fontSize={14}
            />
          </div>
          <div className="flex items-center justify-between border-b border-b-dark/10 !pb-2">
            <ProfileInfo
              title="شماره بیمه بدنه"
              value={insurance?.bodyNumber}
              fontSize={14}
            />
            <ProfileInfo
              title="تاریخ اعتبار"
              value={convertDateToFa(insurance?.bodyExpire)}
              fontSize={14}
            />
          </div>
          <div className="flex items-center justify-between">
            <ProfileInfo
              title="سریال گواهی معاینه فنی"
              value={insurance?.inspectionSerial}
              fontSize={14}
            />
            <ProfileInfo
              title="تاریخ اعتبار"
              value={convertDateToFa(insurance?.inspectionExpire)}
              fontSize={14}
            />
          </div>

          {insurance?.description && (
            <ProfileInfo title="توضیحات" value={insurance?.description} />
          )}

          {insurance.gallery && insurance.gallery.length > 0 && (
            <div className="relative w-full flex items-stretch justify-center">
              <Swiper
                className="mySwiper flex items-center justify-center max-h-24 w-full"
                dir="rtl"
                slidesPerView={3}
                spaceBetween={3}
                breakpoints={{
                  640: {
                    slidesPerView: 3,
                  },
                  768: {
                    slidesPerView: 4,
                  },
                  1024: {
                    slidesPerView: 5,
                  },
                }}
              >
                {insurance.gallery.map((img, index) => (
                  <SwiperSlide key={img}>
                    <div className="w-24 h-24 flex items-center justify-center">
                      <img
                        onClick={() => setShowModal(index)}
                        src={url + img}
                        width={96}
                        height={96}
                        alt={"test"}
                        loading="lazy"
                        className="min-w-16 h-auto object-contain object-center"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {showModal !== null && (
                <Modal className="relative w-full h-full">
                  <div className="w-4/5 h-auto flex items-center justify-center">
                    <button
                      onClick={() => setShowModal(null)}
                      className="text-4xl text-light cursor-pointer absolute left-4 top-4"
                    >
                      <PiX />
                    </button>
                    <MainGallery
                      gallery={insurance.gallery}
                      index={showModal}
                    />
                  </div>
                </Modal>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SingleInsurance;
