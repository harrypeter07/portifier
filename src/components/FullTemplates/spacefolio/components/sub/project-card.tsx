import Image from "next/image";
import Link from "next/link";

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
      <div className="relative h-48 overflow-hidden">
        <Image
          src={src}
          alt={title}
          width={400}
          height={200}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative p-4">
        <h1 className="text-xl font-semibold text-white mb-2">{title}</h1>
        <p className="text-sm text-gray-300 line-clamp-3">{description}</p>
      </div>
    </Link>
  );
};
