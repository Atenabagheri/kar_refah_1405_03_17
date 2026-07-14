
const SkeletonDashboard = () => {
  const baseClass = "basis-1/2 p-2 h-10 w-full";
  const rows = Array.from({ length: 6 });

  return (
    <div className="w-full h-full flex flex-col">
      {rows.map((_, index) => {
        const isEven = index % 2 === 0;
        return (
          <div key={index} className="flex items-center">
            <div
              className={`${baseClass} ${
                isEven ? "bg-white" : "bg-neutral-400/50 animate-pulse"
              }`}
            ></div>
            <div
              className={`${baseClass} ${
                isEven ? "bg-neutral-400/50 animate-pulse" : "bg-white"
              }`}
            ></div>
          </div>
        );
      })}
    </div>
  );
};

export default SkeletonDashboard;
