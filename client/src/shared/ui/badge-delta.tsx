import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/lib/utils"
import {
  RiArrowDownLine,
  RiArrowDownSFill,
  RiArrowRightLine,
  RiArrowRightSFill,
  RiArrowUpLine,
  RiArrowUpSFill,
} from "@remixicon/react"

const badgeDeltaVariants = cva(
  "inline-flex items-center text-xs font-semibold",
  {
    variants: {
      variant: {
        outline:
          "gap-x-1 rounded-sm px-2 py-1 ring-1 ring-inset ring-border",
        solid: "gap-x-1 rounded-sm px-2 py-1",
        solidOutline:
          "gap-x-1 rounded-sm px-2 py-1 ring-1 ring-inset",
        complex:
          "space-x-2.5 rounded-md bg-background py-1 pl-2.5 pr-1 ring-1 ring-inset ring-border",
      },
      deltaType: {
        increase: "",
        decrease: "",
        neutral: "",
      },
      iconStyle: {
        filled: "",
        line: "",
      },
    },
    compoundVariants: [
      { deltaType: "increase", variant: "outline", className: "text-emerald-700" },
      { deltaType: "decrease", variant: "outline", className: "text-red-700" },
      { deltaType: "neutral", variant: "outline", className: "text-gray-700" },
      { deltaType: "increase", variant: "solid", className: "bg-emerald-100 text-emerald-800" },
      { deltaType: "decrease", variant: "solid", className: "bg-red-100 text-red-800" },
      { deltaType: "neutral", variant: "solid", className: "bg-gray-200/50 text-gray-700" },
      { deltaType: "increase", variant: "solidOutline", className: "bg-emerald-100 text-emerald-800 ring-emerald-600/10" },
      { deltaType: "decrease", variant: "solidOutline", className: "bg-red-100 text-red-800 ring-red-600/10" },
      { deltaType: "neutral", variant: "solidOutline", className: "bg-gray-100 text-gray-700 ring-gray-600/10" },
    ],
  },
)

interface BadgeDeltaProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeDeltaVariants> {
  value: string | number
}

const DeltaIcon = ({
  deltaType,
  iconStyle,
}: {
  deltaType: "increase" | "decrease" | "neutral"
  iconStyle: "filled" | "line"
}) => {
  const icons = {
    increase: { filled: RiArrowUpSFill, line: RiArrowUpLine },
    decrease: { filled: RiArrowDownSFill, line: RiArrowDownLine },
    neutral: { filled: RiArrowRightSFill, line: RiArrowRightLine },
  }

  const Icon = icons[deltaType][iconStyle]
  return <Icon className="-ml-0.5 size-4" aria-hidden={true} />
}

export function BadgeDelta({
  className,
  variant = "outline",
  deltaType = "neutral",
  iconStyle = "filled",
  value,
  ...props
}: BadgeDeltaProps) {
  if (variant === "complex") {
    return (
      <span className={cn(badgeDeltaVariants({ variant, className }))} {...props}>
        <span className={cn(
          "text-xs font-semibold",
          deltaType === "increase" && "text-emerald-700",
          deltaType === "decrease" && "text-red-700",
          deltaType === "neutral" && "text-foreground",
        )}>
          {value}
        </span>
        <span className={cn(
          "rounded-sm px-2 py-1 text-xs font-medium",
          deltaType === "increase" && "bg-emerald-100",
          deltaType === "decrease" && "bg-red-100",
          deltaType === "neutral" && "bg-muted",
        )}>
          <DeltaIcon deltaType={deltaType ?? "neutral"} iconStyle="line" />
        </span>
      </span>
    )
  }

  return (
    <span className={cn(badgeDeltaVariants({ variant, deltaType, className }))} {...props}>
      <DeltaIcon deltaType={deltaType ?? "neutral"} iconStyle={iconStyle ?? "filled"} />
      {value}
    </span>
  )
}
