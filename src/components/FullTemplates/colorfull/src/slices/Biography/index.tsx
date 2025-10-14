import Bounded from "../../components/Bounded";
import Button from "../../components/Button";
import Heading from "../../components/Heading";
import Avatar from "./Avatar";
import { JSX } from "react";
import { SliceData } from "../../lib/data";
import React from "react";

/**
 * Props for `Biography`.
 */
export type BiographyProps = {
  slice: SliceData;
};

/**
 * Component for "Biography" Slices.
 */
const Biography = ({ slice }: BiographyProps): JSX.Element => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id="about"
    >

      <div className="grid gap-x-8 gap-y-6 md:grid-cols-[2fr, 1fr]">
        <div className="col-start-1">
          <Heading as="h1" size="xl" className="mb-6">
            {slice.primary.heading}
          </Heading>
          <div className="mb-8 prose prose-xl prose-slate prose-invert">
            {slice.primary.body.map((paragraph: any, index: number) => (
              <p key={index}>{paragraph.content.text}</p>
            ))}
          </div>
          <Button
            linkField={slice.primary.button_link}
            label={slice.primary.button_text}
          />
        </div>

        <div className="col-start-2 row-start-1">
          <Avatar 
            image={slice.primary.avatar}
            className="max-w-sm rounded-[12px]"
          />
        </div>
      </div>
     </Bounded>
  );
};

export default Biography;
