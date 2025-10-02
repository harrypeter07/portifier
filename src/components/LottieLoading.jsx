import React from 'react';
import dynamic from 'next/dynamic';

const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then(m => m.Player),
  { ssr: false }
);

const sizeToPixels = {
  small: 20,
  medium: 28,
  large: 36,
  xlarge: 64,
};

const sizeToGap = {
  small: 'gap-2',
  medium: 'gap-3',
  large: 'gap-4',
  xlarge: 'gap-5',
};

export default function LottieLoading({ message = 'Loading...', size = 'large', showMessage = true, fullScreen = false, inline = false }) {
  const spinnerSize = sizeToPixels[size] || sizeToPixels.large;
  const gapClass = sizeToGap[size] || sizeToGap.large;

  const Container = ({ children }) => (
    <div className={`flex items-center ${inline ? '' : 'justify-center'} ${gapClass} ${fullScreen ? 'min-h-[50vh]' : ''}`}>
      {children}
    </div>
  );

  return (
    <Container>
      <Player
        autoplay
        loop
        src={'/loading.json'}
        style={{ width: spinnerSize, height: spinnerSize }}
      />
      {showMessage && message ? (
        <span className="text-sm text-gray-600 md:text-base">
          {message}
        </span>
      ) : null}
    </Container>
  );
}


