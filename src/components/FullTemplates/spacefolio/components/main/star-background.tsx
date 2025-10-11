"use client";

import { Points, PointMaterial } from "@react-three/drei";
import { Canvas, type PointsProps, useFrame } from "@react-three/fiber";
// import * as random from "maath/random";
import { useState, useRef, Suspense } from "react";
import type { Points as PointsType } from "three";

export const StarBackground = (props: PointsProps) => {
  const ref = useRef<PointsType | null>(null);
  const [sphere] = useState(() => {
    // Create a simple sphere manually without relying on maath
    const positions = new Float32Array(5000);
    for (let i = 0; i < positions.length; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 1.2;
      positions[i] = radius * Math.sin(phi) * Math.cos(angle);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(angle);
      positions[i + 2] = radius * Math.cos(phi);
    }
    return positions;
  });

  useFrame((_state, delta) => {
    if (ref.current && !isNaN(delta)) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        stride={3}
        positions={sphere}
        frustumCulled
        {...props}
      >
        <PointMaterial
          transparent
          color="#fff"
          size={0.002}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

// Simple fallback background component
const FallbackBackground = () => (
  <div className="w-full h-full fixed inset-0 -z-10 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
  </div>
);

export const StarsCanvas = () => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <FallbackBackground />;
  }

  return (
    <div className="w-full h-auto fixed inset-0 -z-10">
      <Canvas 
        camera={{ position: [0, 0, 1] }}
        onError={(error) => {
          console.warn("Canvas error:", error);
          setHasError(true);
        }}
      >
        <Suspense fallback={<FallbackBackground />}>
          <StarBackground />
        </Suspense>
      </Canvas>
    </div>
  );
};
