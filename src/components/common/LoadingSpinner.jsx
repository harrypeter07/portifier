import React from 'react';
import dynamic from 'next/dynamic';

const DotLottiePlayer = dynamic(
  () => import('@dotlottie/react-player').then(m => m.DotLottiePlayer),
  { ssr: false }
);

const sizeToPixels = {
  small: 20,
  medium: 28,
  large: 36,
};

const sizeToGap = {
  small: 'gap-2',
  medium: 'gap-3',
  large: 'gap-4',
};

export default function LoadingSpinner({ message = 'Loading...', size = 'medium', fullScreen = false }) {
  const spinnerSize = sizeToPixels[size] || sizeToPixels.medium;
  const gapClass = sizeToGap[size] || sizeToGap.medium;

  const Container = ({ children }) => (
    <div className={`flex items-center justify-center ${gapClass} ${fullScreen ? 'min-h-[50vh]' : ''}`}>
      {children}
    </div>
  );

  return (
    <Container>
      <DotLottiePlayer
        src={'/Morphing%20Animation.lottie'}
        autoplay
        loop
        style={{ width: spinnerSize, height: spinnerSize }}
      />
      {message && (
        <span className="text-sm text-gray-600 md:text-base">
          {message}
        </span>
      )}
    </Container>
  );
}


