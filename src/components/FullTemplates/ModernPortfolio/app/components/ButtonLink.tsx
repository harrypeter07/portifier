import { FaCartShopping, FaPlus } from "react-icons/fa6";
import Link, { LinkProps } from "next/link";
import clsx from "clsx";

export type ButtonProps = LinkProps & {
  color?: "orange" | "purple" | "lime";
  size?: "sm" | "md" | "lg";
  icon?: "cart" | "skateboard" | "plus";
  className?: string;
  children?: React.ReactNode;
};

export function ButtonLink({
  color = "orange",
  size = "md",
  icon,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <Link
      className={clsx(
        "button-cutout group mx-4 inline-flex items-center bg-gradient-to-b from-25% to-75% bg-[length:100%_400%] font-bold transition-[filter,background-position] duration-300 hover:bg-bottom",
        size === "sm" && "gap-2.5 py-2 text-base",
        size === "md" && "gap-3 px-1 text-lg ~py-2.5/3",
        size === "lg" && "~text-lg/2xl ~gap-3/4 ~px-1/2 ~py-3/4",
        color === "orange" &&
          "from-brand-orange to-brand-lime text-black hover:text-black",
        color === "purple" &&
          "from-brand-purple to-brand-lime text-white hover:text-black",
        color === "lime" && "from-brand-lime to-brand-orange text-black",
        className
      )}
      {...props}
    >
      {icon ? (
        <>
          <div
            className={clsx(
              "flex size-6 items-center justify-center transition-transform group-hover:-rotate-[25deg] [&>svg]:h-full [&>svg]:w-full",
              size === "sm" && "size-5",
              size === "md" && "size-6",
              size === "lg" && "~size-6/8"
            )}
          >
            {icon === "cart" && <FaCartShopping />}
            {icon === "skateboard" && <SkateboardIcon />}
            {icon === "plus" && <FaPlus />}
          </div>
          <div className="w-px self-stretch bg-black/25" />
        </>
      ) : null}
      {children}
    </Link>
  );
}

function SkateboardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 139 80">
      <path
        fill="#000"
        fillOpacity="0"
        d="M111.7 74.4c2.8.6 6.7 0 9.1-2.5l1.3-.5a37 37 0 0 0 4-1.7c2.3-2 6.2-2.5 7.9-6.3l.5-.6a20.6 20.6 0 0 0 2.4-4.2c-.7-3.4 1.5-7 1.3-9.9l-.1-1a27 27 0 0 0-1-3.6c-.5-4-2-8-6-9.8l-1-.7c-1-.6-2-1.1-2.9-1.4-2.3-.7-4.2-1-5.9-1.2l-4.9-.3h-1.1c-2.3.2-4.3 0-6.3-.6a40 40 0 0 1-3-.8 16.7 16.7 0 0 0-8.4-3C94.4 26 91 26 87.3 26a26 26 0 0 1-3-.3 45.5 45.5 0 0 0-9.5-3.5c-3.2-.8-6.4-1.6-9.6-2.7-.3 0-.5-.2-.8-.3-2.1-2-4.3-3-6.5-3.8-2.3-.8-4.6-1.2-7-2l-1.3-.5-.7-.3c-2 0-3.5-.8-5-1.7-1.6-.9-3.1-1.9-5-2.2l-.7-.3h-.3c-1.5-.6-2.8-1.1-4-1.8l-1.7-1-1-.5-1.1-.6C26.2 3.7 22.7.6 18 .7h-1A9.5 9.5 0 0 0 9.8 5l-1 1c-1 1-2 1.9-3.2 2.4l-.9 1.1c-1.4 2-2.5 4-3.2 6.4L1.3 17l-.2 1c-.8 2.3-.2 4.5.2 6.9l.1 1.1a8.1 8.1 0 0 0-.2 4c.5 3.7 4.1 6 6.1 9.3l.6.8c.7.8 1.5 1.5 2.4 2.2l.5.5c1 1 2.2 2 3.4 2.9l.6.4c3.8.5 5.3 4.4 9 5l.8.3c1.2.5 2.4 1 3.7 1.3l1.3.4 1.2.4a7 7 0 0 0-.3 1.7v.6c-1.5 2.2.3 3.3 2 4.5l.2.4.8 1c4.3 3.7 8.2 2.1 12.3-1.5a7.3 7.3 0 0 0 .9-1.9l.4.2 1.4.4c3.9 2 7.6 2.4 11.3 3.5l1 .2 6.3 2 1 .3c3.8-.3 7.4 2 10.8 3.3l1 .3 1.5.5.5.1v1.2l-.1.3v.4c-1.1 2 .7 3 .7 4.4v.7c.3 1.8 1.8 2 3 2.7l.5.2c.4.1.8.3 1.3.3l.8.2c1.1.1 2.4 0 3.8-.3a8 8 0 0 0 1-.2c2.5-.8 4.5-2.8 4.8-5.2l1.4.2c2.3.3 6 .7 9.1.6h1.3l1.2-.1h1Z"
      />
    </svg>
  );
}
