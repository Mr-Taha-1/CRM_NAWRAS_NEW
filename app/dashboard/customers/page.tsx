"use client"

import React, { useState } from "react"
import { UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useOptimizedData } from "@/hooks/use-optimized-data"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { useRole } from "@/hooks/use-role"

export default function CustomersPage() {
  console.log("🔍 [CUSTOMERS DEBUG] Component started loading");
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  console.log("🔍 [CUSTOMERS DEBUG] State initialized");
  
  // Test hooks one by one
  const { user } = useAuth();
  console.log("🔍 [CUSTOMERS DEBUG] useAuth loaded:", user?.email);
  
  const { toast } = useToast();
  console.log("🔍 [CUSTOMERS DEBUG] useToast loaded");
  
  const { isAdmin, canViewAllData, canEditCustomers, canDeleteCustomers } = useRole();
  console.log("🔍 [CUSTOMERS DEBUG] useRole loaded:", { isAdmin: typeof isAdmin });
  
  const { data: customers = [], loading, create, update, remove } = useOptimizedData({
    table: "customers",
    requiresAuth: true
  });
  console.log("🔍 [CUSTOMERS DEBUG] useOptimizedData loaded:", { customersCount: customers.length, loading });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Customers - Test Version
          </h2>
          <p className="text-muted-foreground">
            Testing if component loads properly.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <UserCheck className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>
      <div>
        <p>If you can see this, the component is loading correctly!</p>
        <p>Customers count: {customers.length}</p>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>User: {user?.email}</p>
      </div>
    </div>
  );
}
