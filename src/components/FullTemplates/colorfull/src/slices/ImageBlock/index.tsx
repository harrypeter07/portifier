import { JSX } from "react";
import { SliceData } from "@/lib/data";
import Bounded from "@/components/Bounded";

/**
 * Props for `ImageBlock`.
 */
export type ImageBlockProps = {
  slice: SliceData;
};

/**
 * Component for "ImageBlock" Slices.
 */
const ImageBlock = ({ slice }: ImageBlockProps): JSX.Element => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="flex justify-center">
        <img 
          src={slice.primary.image.url} 
          alt="Content image"
          className="w-full max-w-4xl rounded-lg shadow-lg"
          width={slice.primary.image.width}
          height={slice.primary.image.height}
        />
      </div>
    </Bounded>
  );
};

export default ImageBlock;
