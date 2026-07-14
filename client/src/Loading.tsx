import { PiCircleNotch } from "react-icons/pi";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-light">
      <div className="flex items-center gap-1">
        <PiCircleNotch className="text-neutral-700 text-xl animate-spin" />
        <span className="text-neutral-700">در حال بارگزاری</span>
      </div>
    </div>
  );
};

export default Loading;
