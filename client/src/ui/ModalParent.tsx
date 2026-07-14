import { useEffect, type ReactNode } from "react";

interface PropsType {
    children: ReactNode;
    isOpen?: boolean;
}

const ModalParent = ({ children, isOpen = true }: PropsType) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center w-full h-full z-[999] backdrop-blur-sm">
            <div className="fixed inset-0 bg-dark/30 bg-gradient-to-r to-dark/30 from-dark/30 z-50 p-4"></div>
            <div className="z-[1000] fixed flex items-center justify-center w-[90%] md:w-full">
                {children}
            </div>
        </div>
    );
};

export default ModalParent;
