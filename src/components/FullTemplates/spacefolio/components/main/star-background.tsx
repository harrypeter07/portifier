"use client";

import { Points, PointMaterial } from "@react-three/drei";
import { Canvas, type PointsProps, useFrame } from "@react-three/fiber";
// import * as random from "maath/random";
import { useState, useRef, Suspense, useEffect } from "react";
import type { Points as PointsType } from "three";

export const StarBackground = (props: PointsProps) => {
  const ref = useRef<PointsType | null>(null);
  const [sphere] = useState(() => {
    // Create a completely static and safe sphere with predefined values
    const positions = new Float32Array(5000);
    
    // Use a completely deterministic grid-based approach
    const pointsPerSide = Math.floor(Math.sqrt(positions.length / 3));
    let pointIndex = 0;
    
    for (let i = 0; i < pointsPerSide && pointIndex < positions.length / 3; i++) {
      for (let j = 0; j < pointsPerSide && pointIndex < positions.length / 3; j++) {
        // Create a regular grid pattern
        const u = i / pointsPerSide;
        const v = j / pointsPerSide;
        
        // Convert to spherical coordinates safely
        const theta = u * Math.PI * 2;
        const phi = v * Math.PI;
        
        // Safe radius - always positive
        const radius = 1.2;
        
        // Calculate coordinates with explicit bounds checking
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        // Ensure all values are finite and within bounds
        const safeX = Number.isFinite(x) ? Math.max(-2, Math.min(2, x)) : 0;
        const safeY = Number.isFinite(y) ? Math.max(-2, Math.min(2, y)) : 0;
        const safeZ = Number.isFinite(z) ? Math.max(-2, Math.min(2, z)) : 0;
        
        positions[pointIndex * 3] = safeX;
        positions[pointIndex * 3 + 1] = safeY;
        positions[pointIndex * 3 + 2] = safeZ;
        
        pointIndex++;
      }
    }
    
    // Fill any remaining positions with zeros
    for (let i = pointIndex * 3; i < positions.length; i++) {
      positions[i] = 0;
    }
    
    return positions;
  });

  useFrame((_state, delta) => {
    if (ref.current && Number.isFinite(delta) && delta > 0) {
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

import { SPACEFOLIO_ASSETS } from "../../assets";

// Enhanced fallback background component using Spacefolio assets
const FallbackBackground = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  // Cycle through available videos as fallback
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % SPACEFOLIO_ASSETS.videos.length);
    }, 10000); // Change video every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full fixed inset-0 -z-10 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Try to use video as fallback */}
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        key={currentVideoIndex}
      >
        <source src={SPACEFOLIO_ASSETS.videos[currentVideoIndex]} type="video/webm" />
      </video>
      
      {/* Fallback pattern overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      {/* Floating skill icons as decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {SPACEFOLIO_ASSETS.skills.slice(0, 8).map((skill, index) => (
          <div
            key={skill}
            className="absolute opacity-10 animate-pulse"
            style={{
              left: `${(index * 12.5) % 100}%`,
              top: `${(index * 15) % 100}%`,
              animationDelay: `${index * 0.5}s`,
              animationDuration: `${3 + (index % 3)}s`
            }}
          >
            <img 
              src={skill} 
              alt="" 
              className="w-8 h-8"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const StarsCanvas = () => {
  const [hasError, setHasError] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  // Check WebGL support on mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.warn("WebGL not supported, using fallback background");
        setWebglSupported(false);
      }
    } catch (error) {
      console.warn("WebGL check failed, using fallback background:", error);
      setWebglSupported(false);
    }
  }, []);

  // Use fallback if WebGL not supported or if there's an error
  if (!webglSupported || hasError) {
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
        onCreated={({ gl }) => {
          // Additional error handling for WebGL context
          gl.domElement.addEventListener('webglcontextlost', () => {
            console.warn("WebGL context lost, switching to fallback");
            setHasError(true);
          });
          
          // Check for any immediate errors
          const error = gl.getError();
          if (error !== gl.NO_ERROR) {
            console.warn("WebGL error detected:", error);
            setHasError(true);
          }
        }}
      >
        <Suspense fallback={<FallbackBackground />}>
          <StarBackground />
        </Suspense>
      </Canvas>
    </div>
  );
};
