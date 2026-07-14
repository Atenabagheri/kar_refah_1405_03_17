import { useState } from "react";

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: string;
};

const SmartImage: React.FC<ImageProps> = ({
  fallback = "/assets/images/fallback.svg",
  src,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      {...props}
      src={imgSrc}
      onError={() => {
        if (imgSrc !== fallback) {
          setImgSrc(fallback);
        }
      }}
    />
  );
};

export default SmartImage;
