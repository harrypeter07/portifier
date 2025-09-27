import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90",
        secondary:
          "border-transparent bg-white/20 dark:bg-white/20 text-black dark:text-white hover:bg-white/30 dark:hover:bg-white/30",
        destructive:
          "border-transparent bg-red-600 text-white hover:bg-red-700",
        outline: "text-black dark:text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
