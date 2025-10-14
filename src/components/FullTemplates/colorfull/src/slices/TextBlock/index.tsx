import { JSX } from "react";
import { SliceData } from "../../lib/data";
import Bounded from "../../components/Bounded";
import Heading from "../../components/Heading";
import React from "react";

/**
 * Props for `TextBlock`.
 */
export type TextBlockProps = {
  slice: SliceData;
};

/**
 * Component for "TextBlock" Slices.
 */
const TextBlock = ({ slice }: TextBlockProps): JSX.Element => {
  const isContact = slice.primary.heading?.toLowerCase().includes('contact') || slice.primary.heading?.toLowerCase().includes('touch');
  
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id={isContact ? "contact" : undefined}
    >
      <div className="mx-auto max-w-prose">
        {slice.primary.heading && (
          <Heading as="h2" size="lg" className="mb-6">
            {slice.primary.heading}
          </Heading>
        )}
        <div className="prose prose-lg prose-slate prose-invert">
          {slice.primary.body.map((paragraph: any, index: number) => (
            <p key={index}>{paragraph.content.text}</p>
          ))}
        </div>
      </div>
    </Bounded>
  );
};

export default TextBlock;
