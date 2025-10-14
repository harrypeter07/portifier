import { components } from "../slices";
import { SliceData } from "../lib/data";
import React, { Suspense } from "react";

interface CustomSliceZoneProps {
  slices: SliceData[];
}

export default function CustomSliceZone({ slices }: CustomSliceZoneProps) {
  return (
    <>
      {slices.map((slice, index) => {
        const Component = components[slice.slice_type as keyof typeof components];
        
        if (!Component) {
          console.warn(`No component found for slice type: ${slice.slice_type}`);
          return null;
        }

        return (
          <Suspense key={index} fallback={null}>
            <Component slice={slice} />
          </Suspense>
        );
      })}
    </>
  );
}
