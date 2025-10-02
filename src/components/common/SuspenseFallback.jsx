import React from "react";
import LottieLoading from "../LottieLoading";

export default function SuspenseFallback({ message = "Loading..." }) {
  return (
    <LottieLoading 
      message={message} 
      size="large"
      showMessage={true}
    />
  );
}

