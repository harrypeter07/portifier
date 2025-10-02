import React from "react";
import LottieLoading from "../LottieLoading";

export default function SuspenseFallback({ message = "Loading..." }) {
  return (
    <LottieLoading size="xxlarge" fullScreen={true} showMessage={false} bright={false} />
  );
}

