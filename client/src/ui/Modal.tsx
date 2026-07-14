import type { ReactNode } from "react";

type ModalType = {
  children: ReactNode;
  className?: string;
};

const Modal = ({ children, className }: ModalType) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-full z-[999] backdrop-blur-md">
      <div className="fixed inset-0 bg-black/30 z-40"></div>
      <div
        className={`z-[1000] fixed flex items-center justify-center ${
          className ? className : "w-auto"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
