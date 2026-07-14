// some-inner-component.jsx
import { useSwiper } from "swiper/react";
import { PiCaretLeftBold } from "react-icons/pi";

export default function SlideNextButton() {
  const swiper = useSwiper();

  return (
    <button
      onClick={() => swiper.slideNext()}
      className="absolute top-1/2 -translate-y-1/2 left-2 bg-white rounded-full w-8 h-8 flex items-center justify-center z-[1000] cursor-pointer"
    >
      <PiCaretLeftBold className="text-lg md:text-3xl text-neutral-500" />
    </button>
  );
}
