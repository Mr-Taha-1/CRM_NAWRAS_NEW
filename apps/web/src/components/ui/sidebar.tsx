"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean
}

function Sidebar({ isOpen = true, className, ...props }: SidebarProps) {
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

function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  return (
    <div
      className={cn("flex h-16 items-center border-b px-4", className)}
      {...props}
    />
  )
}

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

function SidebarContent({ className, ...props }: SidebarContentProps) {
  return (
    <div
      className={cn("flex flex-col space-y-4 p-4", className)}
      {...props}
    />
  )
}

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

function SidebarFooter({ className, ...props }: SidebarFooterProps) {
  return (
    <div
      className={cn("mt-auto border-t p-4", className)}
      {...props}
    />
  )
}

interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

function SidebarGroup({ className, ...props }: SidebarGroupProps) {
  return (
    <div
      className={cn("space-y-2", className)}
      {...props}
    />
  )
}

interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

function SidebarGroupLabel({ className, ...props }: SidebarGroupLabelProps) {
  return (
    <div
      className={cn("px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider", className)}
      {...props}
    />
  )
}

interface SidebarGroupContentProps extends React.HTMLAttributes<HTMLDivElement> {}

function SidebarGroupContent({ className, ...props }: SidebarGroupContentProps) {
  return (
    <div
      className={cn("space-y-1", className)}
      {...props}
    />
  )
}

interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

function SidebarMenu({ className, ...props }: SidebarMenuProps) {
  return (
    <nav className={cn("space-y-1", className)} {...props} />
  )
}

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string
  icon?: React.ComponentType<{ className?: string }>
  active?: boolean
}

function SidebarMenuItem({
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

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  isActive?: boolean
  size?: "default" | "sm" | "lg"
}

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  size = "default",
  className,
  children,
  ...props
}: SidebarMenuButtonProps) {
  const sizeClasses = {
    default: "h-8 px-2",
    sm: "h-7 px-1.5 text-sm",
    lg: "h-12 px-4"
  }

  if (asChild) {
    return (
      <div className={cn(
        "flex w-full items-center rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
        isActive && "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white",
        sizeClasses[size],
        className
      )}>
        {children}
      </div>
    )
  }

  return (
    <button
      className={cn(
        "flex w-full items-center rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
        isActive && "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

interface SidebarRailProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean
  onToggle?: () => void
}

function SidebarRail({
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

interface SidebarProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean
}

function SidebarProvider({
  defaultOpen = true,
  className,
  children,
  ...props
}: SidebarProviderProps) {
  return (
    <div className={cn("flex h-screen", className)} {...props}>
      {children}
    </div>
  )
}

interface SidebarInsetProps extends React.HTMLAttributes<HTMLDivElement> {}

function SidebarInset({ className, ...props }: SidebarInsetProps) {
  return (
    <div
      className={cn("flex flex-1 flex-col", className)}
      {...props}
    />
  )
}

interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

function SidebarTrigger({ className, ...props }: SidebarTriggerProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500",
        className
      )}
      {...props}
    >
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
    </button>
  )
}

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
}