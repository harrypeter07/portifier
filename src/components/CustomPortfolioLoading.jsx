import React from "react";
import LottieLoading from "./LottieLoading";

export default function CustomPortfolioLoading() {
  return (
    <LottieLoading 
      message="Hang tight! Your portfolio is loading..." 
      size="xlarge"
      showMessage={true}
    />
  );
} 