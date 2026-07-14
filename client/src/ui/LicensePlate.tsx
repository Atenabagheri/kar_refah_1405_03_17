const LicensePlate = ({ licensePlate }: { licensePlate: string }) => {
  if (licensePlate?.includes("الف")) {
    licensePlate = licensePlate?.replace("الف", "a");
  }
  const numb1 = licensePlate?.slice(6);
  const numb2 = licensePlate?.slice(0, 2);
  const numb3 = licensePlate?.slice(2, -5);
  const numb4 = licensePlate?.slice(3, -2);

  return (
    <div className={`border ${numb3==="a" ? "bg-danger text-light border-dark" : "bg-light border-info"} !p-1 shadow-md rounded-md flex items-center justify-between gap-1 text-black min-w-30 w-fit`}>
      <span className="border border-neutral-300 rounded-md w-8 h-8 flex flex-col items-center justify-center">
        {numb1}
      </span>
      <span className="">{numb4}</span>
      <span className="">{numb3 === "a" ? "الف" : numb3}</span>
      <span className="">{numb2}</span>
    </div>
  );
};

export default LicensePlate;
