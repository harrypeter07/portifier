import clsx from "clsx";
import { MdArrowOutward } from "react-icons/md";
import Link from "next/link";

type ButtonProps = {
    linkField: {
        link_type: string;
        url?: string;
    };
    label: string;
    showIcon?: boolean;
    className?: string;
}


export default function Button ({ linkField , label , showIcon= true , className}: ButtonProps) {
    const href = linkField.url || "#";
    
    return (
        <Link
        href={href}
        className={clsx("group relative flex w-fit  text-slate-800 items-center justify-center overflow-hidden rounded-md border-slate-900 bg-slate-50 px-4 py-2 font-bold transition-transform ease-out hover:scale-105" , className)}>

             <span className="absolute inset-0 z-0 h-full translate-y-9 bg-yellow-300 transition-transform duration-300 ease-in-out group-hover:translate-y-0">

             </span>
             <span className="relative flex items-center justify-center gap-2">
                {label} {showIcon && (<MdArrowOutward className="inline-block"/>)}
             </span>


        </Link>
    )
}