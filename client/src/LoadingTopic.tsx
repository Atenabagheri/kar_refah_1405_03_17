import { PiCircleNotch } from "react-icons/pi";

const LoadingTopic = () => {
  return (
    <div className="flex items-center justify-center h-[92vh] w-full">
      <div className="flex items-center gap-1">
        <PiCircleNotch className="text-neutral-700 text-xl animate-spin" />
        <span className="text-neutral-700 text-sm">در حال بارگزاری</span>
      </div>
    </div>
  );
};

export default LoadingTopic;
