import { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import types
import type { Swiper as SwiperClass } from "swiper";

// Import Swiper styles
// import "swiper/css";

import SlideNextButton from "./SliderNextButton";
import SlidePrevButton from "./SliderPrevButton";
import api from "../../../../../api/axios";

type propsType = {
  image: string | null | undefined;
  gallery: string[] | null | undefined;
};

const RoomGallery = ({ image, gallery }: propsType) => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleSlideChange = (swiper: SwiperClass) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const url = api?.defaults.baseURL;

  return (
    <div className="w-1/2 relative flex items-center justify-end">
      <Swiper
        className="mySwiper w-[240px] lg:w-[320px] xl:w-[360px] 2xl:w-[400px]"
        dir="rtl"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={handleSlideChange}
      >
        {!isEnd && <SlideNextButton />}
        {!isBeginning && <SlidePrevButton />}
        {image && (
          <SwiperSlide>
            <img
              src={url + image}
              width={800}
              height={600}
              alt={"test"}
              loading="lazy"
              className="w-full h-full rounded-md object-cover object-center bg-secondary mx-auto"
            />
          </SwiperSlide>
        )}
        {gallery &&
          gallery.length > 0 &&
          gallery.map((img) => (
            <SwiperSlide>
              <img
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

export default RoomGallery;
