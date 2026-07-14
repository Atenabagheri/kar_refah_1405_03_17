import { PiMicrosoftExcelLogoDuotone } from "react-icons/pi";

type PropsType = {
  title: string;
  fileName: string;
};
const TemplateDownload = ({ title, fileName }: PropsType) => {
  return (
    <div className="bg-success/10 border border-success rounded-lg !p-1 w-fit flex items-center gap-1">
      <PiMicrosoftExcelLogoDuotone className="text-2xl text-success" />
      <a
        href={`/templates/${fileName}`}
        download={fileName}
        className="text-dark/80 text-sm"
      >
        بارگیری فایل اکسل
        <span className="font-bold"> {title} </span>
      </a>
    </div>
    // <div className="bg-success/10 border border-success rounded-lg !p-2 w-fit flex items-center gap-1">
    //   <PiMicrosoftExcelLogoDuotone className="text-2xl text-success" />
    //   <p className="text-sm text-dark">
    //     از{" "}
    //     <a
    //       href={`/templates/${fileName}`}
    //       download={fileName}
    //       className="text-success underline underline-offset-8 font-bold"
    //     >
    //       اینجا
    //     </a>{" "}
    //     فایل خام مربوط به <span className="font-bold"> {title} </span>را بارگیری
    //     نمائید.
    //   </p>
    // </div>
  );
};

export default TemplateDownload;
