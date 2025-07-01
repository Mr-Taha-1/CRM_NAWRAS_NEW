"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useLanguage } from "@/components/language-provider"

// Breadcrumb mapping for different routes
const getBreadcrumbData = (pathname: string, t: (key: string) => string) => {
  const segments = pathname.split('/').filter(Boolean)

  if (pathname === '/dashboard') {
    return { title: t('Dashboard'), parent: null }
  }

  const routeMap: Record<string, { title: string; parent?: string }> = {
    'customers': { title: t('Customers'), parent: t('Dashboard') },
    'deals': { title: t('Deals'), parent: t('Dashboard') },
    'proposals': { title: t('Proposals'), parent: t('Dashboard') },
    'tasks': { title: t('Tasks'), parent: t('Dashboard') },
    'leads': { title: t('Leads'), parent: t('Dashboard') },
    'reports': { title: t('Reports'), parent: t('Dashboard') },
    'settings': { title: t('Settings'), parent: t('Dashboard') },
    'admin': { title: t('Admin Dashboard'), parent: t('Dashboard') },
    'users': { title: t('User Management'), parent: t('Admin Dashboard') },
  }

  const lastSegment = segments[segments.length - 1]
  return routeMap[lastSegment] || { title: t('Dashboard'), parent: null }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!loading && !user && isClient) {
      router.push("/login")
    }
  }, [user, loading, router, isClient])

  if (loading || !isClient) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">{t("Loading...")}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const breadcrumbData = getBreadcrumbData(pathname, t)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-gradient-to-r from-white via-purple-50 to-blue-50 backdrop-blur shadow-sm">
          <SidebarTrigger className="-ml-1 text-purple-600 hover:bg-purple-100" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-purple-200" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbData.parent && (
                <>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard" className="text-purple-600 hover:text-purple-800 font-medium">{breadcrumbData.parent}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block text-purple-400" />
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-800 font-semibold">{breadcrumbData.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex flex-1 flex-col overflow-auto bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}