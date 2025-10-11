import Image from "next/image";
import Link from "next/link";
import React from "react";

type ProjectCardProps = {
  src: string;
  title: string;
  description: string;
  link: string;
};

export const ProjectCard = ({
  src,
  title,
  description,
  link,
}: ProjectCardProps) => {
  return (
    <Link
      href={link}
      target="_blank"
      rel="noreferrer noopener"
      className="relative overflow-hidden rounded-lg shadow-lg border border-[#2A0E61] bg-[#030014] hover:border-[#7042F8] transition-all duration-300"
    >
      <div className="overflow-hidden relative h-48">
        <Image
          src={src}
          alt={title}
          width={400}
          height={200}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="relative p-4">
        <h1 className="mb-2 text-xl font-semibold text-white">{title}</h1>
        <p className="text-sm text-gray-300 line-clamp-3">{description}</p>
      </div>
    </Link>
  );
};
