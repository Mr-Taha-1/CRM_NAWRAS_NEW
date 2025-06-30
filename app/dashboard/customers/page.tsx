"use client"
export const dynamic = 'force-dynamic'

import React, { useState, useEffect, useCallback } from "react"
import { UserCheck, Edit, Trash2, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { useOptimizedData } from "@/hooks/use-optimized-data"
import { countries, getCitiesForCountry } from "@/lib/countries"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { useRole } from "@/hooks/use-role"

// Define contact source options
const contactSources = [
  { value: "Website", label: "🌐 Website" },
  { value: "Referral", label: "👥 Referral" },
  { value: "Cold Call", label: "📞 Cold Call" },
  { value: "Social Media", label: "📱 Social Media" },
  { value: "Trade Show", label: "🎪 Trade Show" },
  { value: "Other", label: "📋 Other" }
]

// Define customer status options
const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Potential", label: "Potential" }
]

// Define form data interface
interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  city: string;
  source: string;
  status: string;
  notes: string;
}

// Define form props interface
interface CustomerFormProps {
  onSubmit: (data: CustomerFormData) => void;
  onCancel: () => void;
}

// Create a separate CustomerForm component to prevent re-renders
const CustomerForm: React.FC<CustomerFormProps> = React.memo(({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    country: "",
    city: "",
    source: "Website",
    status: "active",
    notes: ""
  });
  
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // If country changes, update city list and reset city
      if (name === 'country') {
        const countryObj = countries.find(c => c.name === value);
        if (countryObj) {
          const cities = getCitiesForCountry(countryObj.code);
          setAvailableCities(cities);
          // Reset city when country changes
          newData.city = '';
        } else {
          setAvailableCities([]);
          newData.city = '';
        }
      }
      
      return newData;
    });
  }, []);
  
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  }, [formData, onSubmit]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Contact Person</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            type="email"
                    id="email"
            name="email"
                    value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
          </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
          <input
            type="tel"
                    id="phone"
            name="phone"
                    value={formData.phone}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
        
        <div>
          <label htmlFor="company" className="block text-sm font-medium">Company</label>
          <input
            type="text"
                    id="company"
            name="company"
                    value={formData.company}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium">Country</label>
          <select
            id="country"
            name="country"
                value={formData.country}
            onChange={(e) => handleSelectChange("country", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            <option value="">Select a country</option>
            {countries.map(country => (
              <option key={country.code} value={country.name}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
            </div>
        
        <div>
          <label htmlFor="city" className="block text-sm font-medium">City</label>
          <select
            id="city"
            name="city"
                value={formData.city}
            onChange={(e) => handleSelectChange("city", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
                disabled={!formData.country}
              >
            <option value="">Select a city</option>
            {availableCities.map(city => (
              <option key={city} value={city}>
                      {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="source" className="block text-sm font-medium">Source</label>
          <select
            id="source"
            name="source"
            value={formData.source}
            onChange={(e) => handleSelectChange("source", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Social Media">Social Media</option>
            <option value="Trade Show">Trade Show</option>
            <option value="Other">Other</option>
          </select>
            </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium">Status</label>
          <select
            id="status"
            name="status"
                    value={formData.status}
            onChange={(e) => handleSelectChange("status", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button" 
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Customer
        </button>
      </div>
            </form>
  );
});

// CRITICAL FIX: Add EditCustomerForm component for UPDATE functionality
const EditCustomerForm: React.FC<{ customer: any; onSubmit: (data: CustomerFormData) => void; onCancel: () => void }> = React.memo(({ customer, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CustomerFormData>({
    name: customer?.name || customer?.contact_person || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    company: customer?.company || "",
    country: customer?.country || "",
    city: customer?.city || "",
    source: customer?.contact_source || "Website",  // CRITICAL FIX: Map contact_source to source
    status: customer?.status || "active",
    notes: customer?.notes || ""
  });

  const [availableCities, setAvailableCities] = useState<string[]>([]);

  // Initialize cities when component mounts or country changes
  useEffect(() => {
    if (formData.country) {
      const countryObj = countries.find(c => c.name === formData.country);
      if (countryObj) {
        const cities = getCitiesForCountry(countryObj.code);
        setAvailableCities(cities);
      }
    }
  }, [formData.country]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [name]: value };

      // If country changes, update city list and reset city
      if (name === 'country') {
        const countryObj = countries.find(c => c.name === value);
        if (countryObj) {
          const cities = getCitiesForCountry(countryObj.code);
          setAvailableCities(cities);
          // Reset city when country changes
          newData.city = '';
        } else {
          setAvailableCities([]);
          newData.city = '';
        }
      }

      return newData;
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Edit Customer</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-name">Name *</Label>
          <Input
            id="edit-name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-email">Email *</Label>
          <Input
            id="edit-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-phone">Phone</Label>
          <Input
            id="edit-phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-company">Company *</Label>
          <Input
            id="edit-company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-country">Country</Label>
          <Select value={formData.country} onValueChange={(value) => handleSelectChange('country', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-city">City</Label>
          <Select value={formData.city} onValueChange={(value) => handleSelectChange('city', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              {availableCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-source">Contact Source</Label>
          <Select value={formData.source} onValueChange={(value) => handleSelectChange('source', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a source" />
            </SelectTrigger>
            <SelectContent>
              {contactSources.map((source) => (
                <SelectItem key={source.value} value={source.value}>
                  {source.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-notes">Notes</Label>
        <Textarea
          id="edit-notes"
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Update Customer</Button>
      </div>
    </form>
  );
});

export default function CustomersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null);

  // CRITICAL FIX: Import update and remove functions from useOptimizedData
  const { data: customers = [], loading, create, update, remove } = useOptimizedData({
    table: "customers"
  });
  const { user } = useAuth();
  const { isAdmin, canViewAllData, canEditCustomers, canDeleteCustomers } = useRole();
  const { toast } = useToast();

  const getContactSourceInfo = (sourceValue: string) => {
    return contactSources.find(s => s.value === sourceValue)
  }

  const handleSubmit = async (formData: CustomerFormData) => {
    try {
      // Validate authentication state
      if (!user?.id) {
        toast({ title: "Authentication Error", description: "You must be logged in to create customers.", variant: "destructive" })
        return;
      }

      // Map form data to database schema
      const customerData = {
        name: formData.name,  // Required field for customer name
        contact_person: formData.name,  // Keep for compatibility
        email: formData.email,
        company: formData.company,
        phone: formData.phone || null,
        city: formData.city,
        country: formData.country,
        contact_source: formData.source,  // CRITICAL FIX: Use contact_source instead of source
        status: formData.status,
        notes: formData.notes || null,
        user_id: user.id  // Ensure this matches auth.uid() exactly
      }

      // Create new customer - CRITICAL FIX: Pass table name to create function
      const result = await create(customerData, "customers")

      if (result && typeof result === 'object' && 'error' in result && result.error) {
        console.error("Supabase error:", result.error);
        const errorMessage = result.error.message || 'Unknown error occurred';
        const errorCode = result.error.code || '';
        toast({
          title: "Error creating customer",
          description: `${errorMessage}${errorCode ? ` (${errorCode})` : ''}`,
          variant: "destructive"
        })
        return;
      }

      if (result) {
        toast({ title: "Success", description: "Customer created successfully!", variant: "default" });
        setIsDialogOpen(false)
      }
    } catch (error: any) {
      console.error("Customer creation error:", error);
      const errorMessage = error.message || 'An unexpected error occurred';
      toast({ title: "Error creating customer", description: errorMessage, variant: "destructive" })
    }
  }

  // CRITICAL FIX: Add UPDATE functionality
  const handleEditCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  }

  const handleUpdateSubmit = async (formData: CustomerFormData) => {
    try {
      if (!selectedCustomer?.id || !user?.id) {
        toast({ title: "Error", description: "Invalid customer or authentication state.", variant: "destructive" })
        return;
      }

      // CRITICAL FIX: Map form data with correct field names
      const updateData = {
        name: formData.name,
        contact_person: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone || null,
        city: formData.city,
        country: formData.country,
        contact_source: formData.source,  // CRITICAL FIX: Use contact_source instead of source
        status: formData.status,
        notes: formData.notes || null
      }

      // CRITICAL FIX: Pass table name to update function
      const result = await update(selectedCustomer.id, updateData, "customers")

      if (result) {
        toast({ title: "Success", description: "Customer updated successfully!", variant: "default" });
        setIsEditDialogOpen(false);
        setSelectedCustomer(null);
      }
    } catch (error: any) {
      console.error("Customer update error:", error);
      const errorMessage = error.message || 'Failed to update customer';
      toast({ title: "Error updating customer", description: errorMessage, variant: "destructive" })
    }
  }

  // CRITICAL FIX: Add DELETE functionality with confirmation
  const handleDeleteCustomer = (customerId: string) => {
    setDeletingCustomerId(customerId);
    setIsDeleteDialogOpen(true);
  }

  const confirmDeleteCustomer = async () => {
    try {
      if (!deletingCustomerId) return;

      // CRITICAL FIX: Pass table name to remove function
      const result = await remove(deletingCustomerId, "customers");

      if (result) {
        toast({ title: "Success", description: "Customer deleted successfully!", variant: "default" });
      }
    } catch (error: any) {
      console.error("Customer deletion error:", error);
      const errorMessage = error.message || 'Failed to delete customer';
      toast({ title: "Error deleting customer", description: errorMessage, variant: "destructive" })
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingCustomerId(null);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Customers
            {isAdmin() && (
              <span className="ml-2 text-sm font-normal text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                Admin View
              </span>
            )}
          </h2>
          <p className="text-muted-foreground">
            {isAdmin()
              ? "Manage all customer relationships across the system."
              : "Manage your customer relationships and contact information."
            }
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <UserCheck className="mr-2 h-4 w-4" />
          Add Customer
              </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">
              {isAdmin()
                ? `${customers.length} customers system-wide`
                : `${customers.length} your customers`
              }
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(c => c.status === 'Active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {customers.length ? Math.round((customers.filter(c => c.status === 'Active').length / customers.length) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
      <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 21a9 9 0 0 0 0-18" />
              <path d="M3.6 9h16.8" />
              <path d="M3.6 15h16.8" />
              <path d="M11.5 3a17 17 0 0 0 0 18" />
              <path d="M12.5 3a17 17 0 0 1 0 18" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(customers.map(c => c.country)).size}
              </div>
            <p className="text-xs text-muted-foreground">Global reach</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(c => {
                const now = new Date()
                const created = new Date(c.created_at)
                return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">New customers</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            A comprehensive list of all your customers with advanced filtering options.
          </CardDescription>
            <div className="flex items-center gap-2">
            <div className="relative w-full md:w-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
              >
                <path d="M21 21l-4.486-4.494M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0z" />
              </svg>
              <Input placeholder="Search customers..." className="pl-8" />
            </div>
            <Select defaultValue="all-statuses">
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all-statuses">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="potential">Potential</SelectItem>
                </SelectContent>
              </Select>
            <Select defaultValue="all-countries">
              <SelectTrigger>
                <SelectValue placeholder="All Countries" />
                </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-countries">All Countries</SelectItem>
                {Array.from(new Set(customers.map(c => c.country)))
                  .filter(Boolean)
                  .map(country => (
                    <SelectItem key={country} value={country.toLowerCase()}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            <Select defaultValue="all-sources">
              <SelectTrigger>
                <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all-sources">All Sources</SelectItem>
                {contactSources.map(source => (
                  <SelectItem key={source.value} value={source.value.toLowerCase()}>
                    {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {customer.contact_person}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.city}, {customer.country}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getContactSourceInfo(customer.contact_source)?.label || customer.contact_source}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          customer.status === 'Active' ? 'bg-green-100 text-green-800' : 
                          customer.status === 'Inactive' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditCustomer(customer)}
                              disabled={!canEditCustomers()}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteCustomer(customer.id)}
                              disabled={!canDeleteCustomers()}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
        </CardContent>
      </Card>

      {/* Create Customer Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
          <CustomerForm
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
          <EditCustomerForm
            customer={selectedCustomer}
            onSubmit={handleUpdateSubmit}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setSelectedCustomer(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the customer
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsDeleteDialogOpen(false);
              setDeletingCustomerId(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCustomer}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
