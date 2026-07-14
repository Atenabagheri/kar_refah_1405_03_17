import { Link } from "react-router";
import type { NavSubLink } from "../../../types/types";

interface PropsType {
  sub: NavSubLink[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeadlineSub = ({ sub, setIsOpen }: PropsType) => {
  return (
    <div className="flex flex-col gap-1.5 !p-2">
      {sub?.map((s, index) => (
        <Link
          className={`text-sm whitespace-nowrap text-dark/80`}
          onClick={() => setIsOpen(false)}
          to={s?.path}
          key={index}
        >
          {s?.title}
        </Link>
      ))}
    </div>
  );
};

export default HeadlineSub;
