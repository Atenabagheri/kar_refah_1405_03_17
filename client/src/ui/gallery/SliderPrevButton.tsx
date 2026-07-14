// some-inner-component.jsx
import { PiCaretRightBold } from "react-icons/pi";
import { useSwiper } from "swiper/react";

export default function SlidePrevButton() {
  const swiper = useSwiper();

  return (
    <button
      onClick={() => swiper.slidePrev()}
      className="absolute top-1/2 -translate-y-1/2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center z-[1000] cursor-pointer"
    >
      <PiCaretRightBold className="text-lg md:text-3xl text-neutral-500" />
    </button>
  );
}
