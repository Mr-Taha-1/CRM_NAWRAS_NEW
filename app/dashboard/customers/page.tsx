"use client"

import React, { useState } from "react"
import { UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useOptimizedData } from "@/hooks/use-optimized-data"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { useRole } from "@/hooks/use-role"

export default function CustomersPage() {
  console.log("🚀 [DEPLOYMENT TEST] Component started loading - DEPLOYMENT TEST VERSION");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  console.log("🚀 [DEPLOYMENT TEST] State initialized");

  // Test hooks one by one
  const { user } = useAuth();
  console.log("🚀 [DEPLOYMENT TEST] useAuth loaded:", user?.email);

  const { toast } = useToast();
  console.log("🚀 [DEPLOYMENT TEST] useToast loaded");

  const { isAdmin, canViewAllData, canEditCustomers, canDeleteCustomers } = useRole();
  console.log("🚀 [DEPLOYMENT TEST] useRole loaded:", { isAdmin: typeof isAdmin });

  const { data: customers = [], loading, create, update, remove } = useOptimizedData({
    table: "customers",
    requiresAuth: true
  });
  console.log("🚀 [DEPLOYMENT TEST] useOptimizedData loaded:", { customersCount: customers.length, loading });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-red-600">
            🚀 DEPLOYMENT TEST - CUSTOMERS PAGE 🚀
          </h2>
          <p className="text-muted-foreground text-lg font-bold">
            *** TESTING IF DEPLOYMENT WORKS - THIS SHOULD BE VISIBLE ***
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-red-500 hover:bg-red-600">
          <UserCheck className="mr-2 h-4 w-4" />
          🚀 DEPLOYMENT TEST
        </Button>
      </div>
      <div className="bg-yellow-100 p-4 border-2 border-red-500">
        <h3 className="text-xl font-bold text-red-600">🚀 DEPLOYMENT TEST RESULTS:</h3>
        <p className="text-lg">✅ If you can see this, the deployment is working!</p>
        <p className="text-lg">📊 Customers count: {customers.length}</p>
        <p className="text-lg">⏳ Loading: {loading ? 'Yes' : 'No'}</p>
        <p className="text-lg">👤 User: {user?.email}</p>
        <p className="text-lg">🕐 Test Time: {new Date().toISOString()}</p>
      </div>
    </div>
  );
}
