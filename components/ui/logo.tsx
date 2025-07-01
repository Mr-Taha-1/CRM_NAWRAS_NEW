"use client"

import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Logo({ size = "md", className }: LogoProps) {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-12",
  }

  return (
    <div className={cn("flex items-center", className)}>
      <img
        src="/logo.png"
        alt="Nawras CRM"
        className={cn("object-contain", sizeClasses[size])}
      />
    </div>
  )
} 