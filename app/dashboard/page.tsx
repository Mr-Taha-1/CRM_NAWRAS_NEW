"use client"

import { useCallback, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useOptimizedData } from "@/hooks/use-optimized-data"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { CustomerForm } from "@/components/customer-form"
import { useLanguage } from "@/components/language-provider"
import { CustomerFormData, mapFormToDatabase, CustomerDatabaseSchema } from "@/app/types/customer"
import { Users, TrendingUp, AlertCircle } from "lucide-react"

interface DashboardStats {
  totalCustomers: number
  activeCustomers: number
  pendingFollowUps: number
}

export default function DashboardPage() {
  const { t } = useLanguage()
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    activeCustomers: 0,
    pendingFollowUps: 0,
  })

  useEffect(() => {
    // TODO: Fetch real stats from API
    setStats({
      totalCustomers: 150,
      activeCustomers: 89,
      pendingFollowUps: 12,
    })
  }, [])

  const cards = [
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      description: "Total number of customers in the system",
    },
    {
      title: "Active Customers",
      value: stats.activeCustomers,
      icon: TrendingUp,
      description: "Customers with active engagement",
    },
    {
      title: "Pending Follow-ups",
      value: stats.pendingFollowUps,
      icon: AlertCircle,
      description: "Customers requiring follow-up",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("Dashboard Overview")}</h1>
        <p className="text-gray-500 mt-2">
          {t("Welcome back! Here's what's happening with your customers.")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {t(card.title)}
              </CardTitle>
              <card.icon className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
              <p className="text-sm text-gray-500 mt-2">
                {t(card.description)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 