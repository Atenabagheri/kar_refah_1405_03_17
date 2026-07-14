import { useState } from "react";

const Test = () => {
  const [counter, setCounter] = useState<number>(0);
  return (
    <button
      onClick={() => setCounter(counter + 1)}
      className="bg-blue-200 rounded-md !p-2 cursor-pointer"
    >
      تست: {counter}
    </button>
  );
};

export default Test;
