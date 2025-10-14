"use client"
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import React, { JSX, useEffect, useRef } from "react";
import { MdCircle } from "react-icons/md";
import { SliceData } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger)
/**
 * Props for `TechList`.
 */
export type TechListProps = {
  slice: SliceData;
};

/**
 * Component for "TechList" Slices.
 */
const TechList = ({ slice }: TechListProps): JSX.Element => {

 const component = useRef(null);

 useEffect(()=>{
  let ctx = gsap.context(()=> {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:component.current,
          // markers:true,
          start: "top bottom",
          end: "bottom top",
          scrub:4,
          invalidateOnRefresh: true,
        }
      })

      tl.fromTo(".tech-row" , {
        x:(index)=> {
          return index % 2 === 0 ?
           gsap.utils.random(600 , 400) :
            gsap.utils.random(-600 , -400)
        }
      }, {
        x:(index)=> {
        return index % 2 === 0 ?
        gsap.utils.random(-600 , -400) :
         gsap.utils.random(600 , 400)
        } ,
        ease: "none",
        duration: 1
      }
    )

  }  ,component)

  return ()=> ctx.revert()
 }, [])



  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="overflow-hidden"
      ref={component}
      id="skills"
    >

      <Bounded as="div">
      <Heading size="xl" className="mb-8" as="h2">
      {slice.primary.heading}
      </Heading>
      </Bounded>
     
      {slice.items.map(({ tech_color , tech_name} , index) => (
  // Render the item
  <div key={index} className="tech-row mb-8 flex items-center justify-center gap-4 text-slate-700 whitespace-nowrap will-change-transform"
  aria-label={tech_name || ""}>

    {Array.from({length: 15}, (_, index) => (
      <React.Fragment key={index} >
          <span 
          style={{
            color: index === 7 && tech_color ? tech_color : "inherit",
          }}
          className="tech-item text-8xl font-extrabold uppercase tracking-tighter">
              {tech_name}

          </span>
          <span className="text-3xl">
            <MdCircle/>
          </span>
      </React.Fragment>
      ))}
  </div>
))}
      
    </section>
  );
};

export default TechList;
