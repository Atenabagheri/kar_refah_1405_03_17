import React from "react";

type PropsType = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  controllerRef?: React.RefObject<AbortController | null>;
};
const CancelReqButton = ({ loading, setLoading, controllerRef }: PropsType) => {
  const cancelSend = () => {
    if (controllerRef?.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
      setLoading(false);
    }
  };
  return (
    loading && (
      <button
        onClick={cancelSend}
        className="bg-dark/90 text-light border border-dark/90 px-4 py-2 rounded-lg fixed left-10 bottom-10 z-50 cursor-pointer"
      >
        لغو ارسال
      </button>
    )
  );
};

export default CancelReqButton;
