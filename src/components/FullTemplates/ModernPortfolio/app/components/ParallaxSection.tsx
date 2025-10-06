'use client';
import { useRef, useEffect, ReactNode, FC, Children, isValidElement, cloneElement } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import React from 'react';

interface ParallaxItemProps {
  children: ReactNode;
  i?: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

const ParallaxItem: FC<ParallaxItemProps> = ({ children, i = 0, progress, range, targetScale }) => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress: itemProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  });

  // Transform for the content scale
  const scale = useTransform(progress, range, [1, targetScale]);
  
  // Transform for any images inside
//   const imageScale = useTransform(itemProgress, [0, 1], [1.2, 1]);
  
  // Clone the child element and inject the imageScale for any images it might contain
  const enhancedChild = isValidElement(children) 
    ? cloneElement(children, { 
        // Pass the imageScale to child component if needed
        // imageScaleValue: imageScale 
      }) 
    : children;

  const MotionDiv: any = motion.div;
  return (
    <div ref={container} className="parallax-item-container" style={{ 
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'sticky',
      top: '0px',
      width: '100%'
    }}>
      <MotionDiv
        className="parallax-item"
        style={{
          scale,
          position: 'relative',
          top: `calc(-5vh + ${i * 25}px)`,
          width: '100%',
          transformOrigin: 'top',
        }}
        data-progress={String(itemProgress.get())}
      >
        {enhancedChild}
      </MotionDiv>
    </div>
  );
};

interface ParallaxSectionProps {
  children: ReactNode | ReactNode[];
}

const ParallaxSection: FC<ParallaxSectionProps> = ({ children }) => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    
    return () => {
      lenis.destroy();
    };
  }, []);

  const childrenArray = Children.toArray(children);

  return (
    <div ref={container} className="mt-24 bg-gray-700 parallax-container relative">
      {childrenArray.map((child, i) => {
        // Calculate target scale (decreasing for each section)
        const targetScale = 1 - ((childrenArray.length - i) * 0.05);
        
        // Calculate the range for this section
        // Each section will be in view for a portion of the scroll
        const range: [number, number] = [i * 0.25, 1];
        
        return (
          <ParallaxItem 
            key={`section_${i}`} 
            i={i} 
            progress={scrollYProgress} 
            range={range} 
            targetScale={targetScale}
          >
            {child}
          </ParallaxItem>
        );
      })}
    </div>
  );
};

export default ParallaxSection;