import React from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function SuspenseFallback({ message = "Loading..." }) {
  return (
    <LoadingSpinner 
      message={message}
      size="large"
      fullScreen={true}
    />
  );
}

