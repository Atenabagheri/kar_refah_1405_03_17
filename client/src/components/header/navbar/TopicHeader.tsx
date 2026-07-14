import { useEffect, useRef, useState } from "react";
import SubTopicHeader from "./SubTopicHeader";
import type { NavLink } from "../../../types/types";
import Headline from "./Headline";

const TopicHeader = ({ title, sub, headline, isAccess }: NavLink) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLLIElement>(null);
  // const pathName = useLocation()?.pathname;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);
  return (
    isAccess && (
      <li ref={menuRef} className="relative cursor-pointer">
        <span className="text-white" onClick={() => setIsOpen(!isOpen)}>
          {title}
        </span>
        {isOpen && sub && sub?.length > 0 ? (
          <SubTopicHeader setIsOpen={setIsOpen} sub={sub} />
        ) : isOpen && headline && headline?.length > 0 ? (
          <div className="min-w-[100px] w-fit top-8 z-30 shadow-[12px_12px_5px_-4px_rgba(232,232,232,0.75)] bg-light absolute !p-2.5 rounded-md flex flex-col gap-2">
            {headline?.map((h, index) => (
              <Headline key={index} headline={h} setIsOpen={setIsOpen} />
            ))}
          </div>
        ) : (
          ""
        )}
      </li>
    )
  );
};

export default TopicHeader;
