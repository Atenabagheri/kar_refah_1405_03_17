import React, { type ReactNode } from "react";
import { Link, useLocation } from "react-router";
import type { NavSubLink } from "../../../types/types";

type SubTopic = {
  sub: NavSubLink[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children?: ReactNode;
  className?: string;
};

const SubTopicHeader = ({ setIsOpen, sub, children, className }: SubTopic) => {
  const pathName = useLocation()?.pathname;
  return (
    <div
      className={`min-w-[100px] w-fit top-8 z-30 shadow-[12px_12px_5px_-4px_rgba(232,232,232,0.75)] bg-light absolute !p-2.5 rounded-md flex flex-col gap-2 ${className}`}
    >
      {sub?.map((s: NavSubLink, index: number) => (
        <Link
          className={`text-sm whitespace-nowrap ${pathName === s?.path && "text-primary/80"}`}
          onClick={() => setIsOpen(false)}
          to={s?.path}
          key={index}
        >
          {s?.title}
        </Link>
      ))}
      {children}
    </div>
  );
};

export default SubTopicHeader;
