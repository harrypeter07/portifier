"use client"
import clsx from "clsx";
import gsap from "gsap";
import React from "react";
import { useEffect, useRef } from "react";

type AvatarProps = {
    image: {
        url: string;
        width: number;
        height: number;
    };
    className?: string;
    alt?: string;
}

export default function Avatar({
    image,
    className,
    alt,
}:AvatarProps){

    const component = useRef(null)
    useEffect(()=> {
        let ctx = gsap.context(() => {
            gsap.fromTo(
                ".avatar" ,{
                  opacity:0,
                  scale:1.4,

                },
                {
                    opacity:1,
                    scale:1,
                    duration:1.3,
                    ease:"power3.inOut"
                    
                  }
            )

            window.onmousemove =(e)=>{
                if (!component.current) return;

                const componentReact = (component.current as HTMLElement).getBoundingClientRect()
                const componentCenterX = componentReact.left + componentReact.width /2

                let componentPercent = {
                    x: (e.clientX - componentCenterX) / componentReact.width /2

                }

                let distFromCenter = 1 -Math.abs(componentPercent.x)
           
               gsap.timeline({
                defaults : {
                    duration: 0.5,
                overwrite: "auto" ,
                 ease: "power3.out"
                }
               }).to(".avatar", {
                rotation: gsap.utils.clamp(-2 , 2 ,5 * componentPercent.x),
                duration: 0.5,
               }).to(".highlight", {
                 opacity: distFromCenter - 0.7,
                 x: -10 + 20 * componentPercent.x,
                 duration: 0.5
               },0,
            )
            } 
        } , component);
        return ()=> ctx.revert(); //clean
    } , [])
    return (
        <div ref={component} className={clsx("relative w-full h-full" , className)}>
            <div className="overflow-hidden rounded-3xl border-2 avatar border-slate-700 opacity-1">
            <img 
                src={image?.url || "/logo.png"} 
                alt={alt || "Avatar"} 
                className="object-fill w-full h-full avatar-image"
                width={image?.width || 400}
                height={image?.height || 400}
            />

            <div className="hidden absolute inset-0 w-full bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 scale-110 highlight md:block"></div>

            </div>
        </div>
    )
}