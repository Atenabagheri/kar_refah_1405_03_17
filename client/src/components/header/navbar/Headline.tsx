import { PiCaretDown } from "react-icons/pi";
import type { NavSubLink } from "../../../types/types";
import { useState } from "react";
import HeadlineSub from "./HeadlineSub";

interface PropsType {
  headline: {
    title: string;
    sub: NavSubLink[];
  };
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Headline = ({ headline, setIsOpen }: PropsType) => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div>
      <div
        onClick={() => setShowDetails(!showDetails)}
        className="relative flex items-center justify-between gap-4"
      >
        <span className="whitespace-nowrap text-sm">{headline?.title}</span>
        <PiCaretDown className={`${showDetails?"":"rotate-90"} transition-all duration-200`} />
      </div>
      {showDetails && <HeadlineSub sub={headline?.sub} setIsOpen={setIsOpen} />}
    </div>
  );
};

export default Headline;
