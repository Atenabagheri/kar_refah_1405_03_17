import { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import types
import type { Swiper as SwiperClass } from "swiper";

// Import Swiper styles
// import "swiper/css";

import SlideNextButton from "./SliderNextButton";
import SlidePrevButton from "./SliderPrevButton";
import api from "../../../api/axios";
import SmartImage from "../../utils/SmartImage";

type propsType = {
  image?: string | null | undefined;
  gallery?: string[] | null | undefined;
  index?: number;
};

const MainGallery = ({ image, gallery, index }: propsType) => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleSlideChange = (swiper: SwiperClass) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const url = api?.defaults.baseURL;

  return !image && gallery && gallery?.length < 1 ? (
    <div className="w-full relative flex items-center justify-end">
      <div className="mySwiper w-[240px] lg:w-[320px] xl:w-[360px] 2xl:w-[400px] rounded-xl">
        <img
          src="/assets/images/not-found.png"
          width={400}
          height={400}
          alt="بدون تصویر"
          className="w-full h-full rounded-md object-cover object-center bg-white mx-auto"
        />
      </div>
    </div>
  ) : (
    <div className="w-full relative flex items-center justify-end">
      <Swiper
        className="mySwiper w-[240px] lg:w-[320px] xl:w-[360px] 2xl:w-[400px]"
        dir="rtl"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={handleSlideChange}
        initialSlide={index}
      >
        {!isEnd && gallery && gallery.length > 0 && <SlideNextButton />}
        {!isBeginning && gallery && gallery.length > 0 && <SlidePrevButton />}
        {image && (
          <SwiperSlide>
            <SmartImage
              src={url + image}
              alt="main image"
              width={800}
              height={600}
              loading="lazy"
              className="w-full h-full rounded-md object-cover object-center bg-white mx-auto"
            />
            {/* <img
              src={url + image}
              width={800}
              height={600}
              alt={"test"}
              loading="lazy"
              className="w-full h-full rounded-md object-cover object-center bg-secondary mx-auto"
            /> */}
          </SwiperSlide>
        )}
        {gallery &&
          gallery.length > 0 &&
          gallery.map((img) => (
            <SwiperSlide>
              <img
                defaultValue={url + img}
                key={img}
                src={url + img}
                width={800}
                height={600}
                alt={"test"}
                loading="lazy"
                className="w-full h-full rounded-md object-cover object-center bg-secondary mx-auto"
              />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default MainGallery;
