"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean
}

export function Sidebar({ isOpen = true, className, ...props }: SidebarProps) {
  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 transform bg-white transition-transform duration-200 ease-in-out dark:bg-gray-800",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}
      {...props}
    />
  )
}

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  return (
    <div
      className={cn("flex h-16 items-center border-b px-4", className)}
      {...props}
    />
  )
}

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarContent({ className, ...props }: SidebarContentProps) {
  return (
    <div
      className={cn("flex flex-col space-y-4 p-4", className)}
      {...props}
    />
  )
}

interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarMenu({ className, ...props }: SidebarMenuProps) {
  return (
    <nav className={cn("space-y-1", className)} {...props} />
  )
}

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string
  icon?: React.ComponentType<{ className?: string }>
  active?: boolean
}

export function SidebarMenuItem({
  href,
  icon: Icon,
  children,
  active,
  className,
  ...props
}: SidebarMenuItemProps) {
  const pathname = usePathname()
  const isActive = active ?? pathname === href

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white",
        className
      )}
      {...props}
    >
      {Icon && (
        <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-gray-900 dark:text-white" : "text-gray-400")} />
      )}
      {children}
    </Link>
  )
}

interface SidebarRailProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean
  onToggle?: () => void
}

export function SidebarRail({
  isOpen = true,
  onToggle,
  className,
  children,
  ...props
}: SidebarRailProps) {
  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-30 flex h-screen w-16 flex-col items-center border-r bg-white py-4 dark:bg-gray-800",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
} 