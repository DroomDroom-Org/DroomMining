import * as React from "react"
import { cn } from "@/lib/utils"

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => {
    const base = orientation === "horizontal"
      ? "h-[1px] w-full"
      : "h-full w-[1px]"

    return (
      <div
        ref={ref}
        className={cn(
          "shrink-0 bg-border",
          base,
          className
        )}
        {...props}
      />
    )
  }
)
Separator.displayName = "Separator"

export { Separator }