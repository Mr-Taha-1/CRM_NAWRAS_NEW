"use client"

import type * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import { useRole } from "@/hooks/use-role"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  BarChart3,
  Building2,
  Calendar,
  ChevronUp,
  CreditCard,
  DollarSign,
  FileText,
  HelpCircle,
  Home,
  LogOut,
  Settings,
  TrendingUp,
  Users,
  User,
  Briefcase,
  Target,
  Receipt,
  MessageSquare,
  Globe,
  Sparkles,
  Star,
} from "lucide-react"

// Navigation item interfaces
interface NavigationItem {
  title: string
  url: string
  icon: React.ComponentType<any>
  description: string
  badge?: number
}

interface NavigationGroup {
  title: string
  items: NavigationItem[]
}

// Function to get navigation data based on user role
const getNavigationData = (isAdmin: boolean, isManager: boolean, t: (key: string) => string): {
  navMain: NavigationGroup[]
  navSecondary: NavigationItem[]
} => {
  const baseNavigation: NavigationGroup[] = [
    {
      title: "Main",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: Home,
          description: "Overview and metrics",
        },
      ],
    },
    {
      title: "Sales",
      items: [
        {
          title: "Customers",
          url: "/dashboard/customers",
          icon: Users,
          description: "Customer management",
        },
        {
          title: "Deals",
          url: "/dashboard/deals",
          icon: DollarSign,
          description: "Sales pipeline",
        },
        {
          title: "Proposals",
          url: "/dashboard/proposals",
          icon: MessageSquare,
          description: "Client proposals",
        },
      ],
    },
    {
      title: "Operations",
      items: [
        {
          title: "Tasks",
          url: "/dashboard/tasks",
          icon: Calendar,
          description: "Task management",
        },
        {
          title: "Leads",
          url: "/dashboard/leads",
          icon: TrendingUp,
          description: "Lead tracking",
        },
        {
          title: "Projects",
          url: "/dashboard/projects",
          icon: Briefcase,
          description: "Project management",
        },
      ],
    },
    {
      title: "Analytics",
      items: [
        {
          title: "Reports",
          url: "/dashboard/reports",
          icon: BarChart3,
          description: "Business reports",
        },
      ],
    },
    {
      title: "Finance",
      items: [
        {
          title: "Expenses",
          url: "/dashboard/expenses",
          icon: Receipt,
          description: "Expense tracking",
        },
        {
          title: "Invoices",
          url: "/dashboard/invoices",
          icon: CreditCard,
          description: "Invoice management",
        },
        {
          title: "Payment",
          url: "/dashboard/payment",
          icon: DollarSign,
          description: "Payment processing",
        },
        {
          title: "Estimates",
          url: "/dashboard/estimates",
          icon: Target,
          description: "Project estimates",
        },
      ],
    },
  ]

  // Add admin-specific navigation sections
  if (isAdmin) {
    baseNavigation.push({
      title: t("nav.administration"),
      items: [
        {
          title: t("nav.userManagement"),
          url: "/dashboard/users",
          icon: User,
          description: "Manage system users",
        },
        {
          title: t("nav.settings"),
          url: "/dashboard/settings",
          icon: Settings,
          description: "System settings",
        },
      ],
    })
  }

  // Add manager-specific items
  if (isManager || isAdmin) {
    // Add team management to operations
    const operationsIndex = baseNavigation.findIndex(group => group.title === "Operations")
    if (operationsIndex !== -1) {
      baseNavigation[operationsIndex].items.push({
        title: "Team Reports",
        url: "/dashboard/team/reports",
        icon: BarChart3,
        description: "Team performance",
      })
    }
  }

  const navSecondary: NavigationItem[] = [
    {
      title: "Support",
      url: "/dashboard/support",
      icon: HelpCircle,
      description: "Help center",
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
      description: "Account settings",
    },
  ]

  // Add admin settings
  if (isAdmin) {
    navSecondary.push({
      title: "Admin Panel",
      url: "/dashboard/admin",
      icon: Settings,
      description: "System administration",
    })
  }

  return {
    navMain: baseNavigation,
    navSecondary,
  }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { t, toggleLanguage, language } = useLanguage()
  const { isAdmin, hasRole } = useRole()

  // Get role-based navigation data
  const navigationData = getNavigationData(isAdmin(), hasRole('manager'), t)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <Sidebar
      {...props}
      className="border-r-0 shadow-lg overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 25%, #3730a3 50%, #581c87 75%, #1e1b4b 100%)",
        borderRight: "1px solid rgba(255, 255, 255, 0.1)"
      }}
    >
      <SidebarRail />
      
      <SidebarHeader 
        className="p-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent backdrop-blur-sm"
      >
        <div className="group/header flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer">
          <div className="flex aspect-square size-12 items-center justify-center rounded-xl bg-gradient-to-br from-white/20 to-white/10 text-white shadow-lg group-hover/header:shadow-xl group-hover/header:scale-110 transition-all duration-300 backdrop-blur-sm">
            <Sparkles className="size-6 group-hover/header:rotate-12 transition-transform duration-300" />
          </div>
          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate font-bold text-xl text-white drop-shadow-lg transition-all duration-300 group-hover/header:scale-105">
              Nawras CRM
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="truncate text-sm text-white/90 font-medium">Enterprise Edition</span>
              <Badge 
                variant="secondary" 
                className="h-5 px-2 text-xs bg-gradient-to-r from-amber-400/30 to-orange-400/30 text-amber-100 border-amber-400/40 backdrop-blur-sm"
              >
                <Star className="size-2 mr-1" />
                <span className="font-bold">Pro</span>
              </Badge>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent
        className="px-4 py-3 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30 transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 25%, #3730a3 50%, #581c87 75%, #1e1b4b 100%)"
        }}
      >
        {navigationData.navMain.map((group, groupIndex) => (
          <SidebarGroup key={group.title} className="py-3">
            <SidebarGroupLabel className="px-3 py-2 text-xs font-bold text-white/70 uppercase tracking-wider mb-3 flex items-center gap-2">
              <div className="w-6 h-0.5 bg-gradient-to-r from-white/40 to-transparent rounded-full" />
              {t(group.title)}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {group.items.map((item) => {
                  const isActive = pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={`
                          group relative h-11 w-full justify-start rounded-xl px-4 py-2 text-sm font-medium
                          transition-all duration-300 ease-out overflow-hidden
                          hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                          ${isActive
                            ? 'bg-gradient-to-r from-white/20 to-white/10 text-white shadow-md ring-1 ring-white/20 backdrop-blur-sm'
                            : 'text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5'
                          }
                        `}
                      >
                        <Link href={item.url} className="flex items-center gap-3 w-full">
                          <div className={`
                            flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300
                            ${isActive
                              ? 'bg-white/20 shadow-sm'
                              : 'bg-white/10 group-hover:bg-white/15'
                            }
                          `}>
                            <item.icon className={`size-4 transition-all duration-300 ${
                              isActive ? 'text-white' : 'text-white/80 group-hover:text-white'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium transition-all duration-300 ${
                              isActive ? 'text-white' : 'text-white/90 group-hover:text-white'
                            }`}>
                              {t(item.title)}
                            </div>
                            <div className={`text-xs transition-all duration-300 ${
                              isActive ? 'text-white/80' : 'text-white/60 group-hover:text-white/70'
                            }`}>
                              {t(item.description)}
                            </div>
                          </div>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto bg-white/20 text-white text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Secondary Navigation */}
        <SidebarGroup className="py-3">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationData.navSecondary.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`
                        group relative h-10 w-full justify-start rounded-xl px-4 py-2 text-sm
                        transition-all duration-300 ease-out
                        hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                        ${isActive
                          ? 'bg-gradient-to-r from-white/20 to-white/10 text-white shadow-md ring-1 ring-white/20 backdrop-blur-sm'
                          : 'text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5'
                        }
                      `}
                    >
                      <Link href={item.url} className="flex items-center gap-3 w-full">
                        <item.icon className={`size-4 transition-all duration-300 ${
                          isActive ? 'text-white' : 'text-white/80 group-hover:text-white'
                        }`} />
                        <span className={`font-medium transition-all duration-300 ${
                          isActive ? 'text-white' : 'text-white/90 group-hover:text-white'
                        }`}>
                          {t(item.title)}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter
        className="p-4 border-t border-white/10 bg-gradient-to-r from-white/5 to-transparent backdrop-blur-sm"
      >
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="group h-14 w-full rounded-xl hover:bg-white/10 hover:shadow-lg transition-all duration-300 text-white relative z-10 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Avatar className="h-10 w-10 ring-2 ring-white/30 group-hover:ring-white/50 transition-all duration-300 shadow-lg">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                    <AvatarFallback className="bg-gradient-to-br from-white/20 to-white/10 text-white text-lg font-bold backdrop-blur-sm">
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-bold text-white group-hover:text-white transition-all duration-300">
                      {user?.email || "user@example.com"}
                    </span>
                    <span className="truncate text-xs text-white/70 group-hover:text-white/80 transition-all duration-300">
                      {user?.role ? t(`roles.${user.role}`) : t("roles.user")}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-5 text-white/70 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-64 rounded-xl shadow-xl border border-border/50 bg-white/95 backdrop-blur-xl"
                side="bottom"
                align="end"
                sideOffset={8}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-3 px-3 py-3 text-left text-sm">
                    <Avatar className="h-10 w-10 ring-2 ring-blue-200/50 shadow-md">
                      <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold">
                        {user?.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-bold text-gray-900">
                        {user?.email || "user@example.com"}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user?.role ? t(`roles.${user.role}`) : t("roles.user")}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 rounded-lg mx-2 h-9 transition-all duration-200">
                  <User className="mr-2 h-4 w-4" />
                  <span className="font-medium">{t("Account")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 rounded-lg mx-2 h-9 transition-all duration-200">
                  <Settings className="mr-2 h-4 w-4" />
                  <span className="font-medium">{t("Settings")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 rounded-lg mx-2 h-9 transition-all duration-200"
                  onClick={toggleLanguage}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  <span className="font-medium">
                    {language === "en" ? "العربية" : "English"}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-red-50 focus:bg-red-50 text-red-600 hover:text-red-700 focus:text-red-700 rounded-lg mx-2 h-9 transition-all duration-200"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="font-medium">{t("Sign Out")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
