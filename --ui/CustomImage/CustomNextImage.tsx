import assets from "@/json/assets";
import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

const CustomNextImage = (props: ImageProps) => {
  const { src, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      {...rest}
      src={imgSrc}
      onError={() => {
        setImgSrc(assets.logo_img);
      }}
    />
  );
};

export default CustomNextImage;
