import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white dark:ring-offset-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90",
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
        outline:
          "border border-white dark:border-white bg-white dark:bg-black hover:bg-white/20 dark:hover:bg-white/20 hover:text-black dark:hover:text-white",
        secondary:
          "bg-white/20 dark:bg-white/20 text-black dark:text-white hover:bg-white/30 dark:hover:bg-white/30",
        ghost: "hover:bg-white/20 dark:hover:bg-white/20 hover:text-black dark:hover:text-white",
        link: "text-black dark:text-white underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
