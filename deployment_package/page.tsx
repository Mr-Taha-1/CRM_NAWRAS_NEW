"use client"

import React, { useState, useEffect } from "react"
import { UserCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { useOptimizedData } from "@/hooks/use-optimized-data"
import { countries, getCitiesForCountry } from "@/lib/countries"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

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
  address: string;
  country: string;
  city: string;
  source: string;
  status: string;
  total_value: number;
  notes: string;
}

// Define form props interface
interface CustomerFormProps {
  onSubmit: (data: CustomerFormData) => void;
  onCancel: () => void;
}

// Create a separate CustomerForm component to prevent re-renders
const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    country: "",
    city: "",
    source: "",
    status: "Active",
    total_value: 0,
    notes: ""
  })
  
  const [availableCities, setAvailableCities] = useState<string[]>([])
  
  // Update available cities when country changes
  useEffect(() => {
    if (formData.country) {
      const countryObj = countries.find(c => c.name === formData.country)
      if (countryObj) {
        const cities = getCitiesForCountry(countryObj.code)
        setAvailableCities(cities)
      }
    } else {
      setAvailableCities([])
    }
  }, [formData.country])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl">
          <UserCheck className="h-5 w-5" />
          Add New Customer
        </DialogTitle>
        <DialogDescription>
          Fill in the information below to add a new customer to your CRM.
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Contact Name *</Label>
          <Input 
            id="name" 
            name="name" 
            placeholder="Contact Name *" 
            value={formData.name} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="Email *" 
            value={formData.email} 
            onChange={handleInputChange} 
            required 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone" 
            name="phone" 
            placeholder="Phone" 
            value={formData.phone} 
            onChange={handleInputChange} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company *</Label>
          <Input 
            id="company" 
            name="company" 
            placeholder="Company *" 
            value={formData.company} 
            onChange={handleInputChange} 
            required 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input 
          id="address" 
          name="address" 
          placeholder="Address" 
          value={formData.address} 
          onChange={handleInputChange} 
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Select 
            name="country" 
            value={formData.country} 
            onValueChange={(value) => handleSelectChange("country", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.name}>
                  {country.flag} {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Select 
            name="city" 
            value={formData.city} 
            onValueChange={(value) => handleSelectChange("city", value)}
            required
            disabled={!formData.country}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {availableCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="source">Contact Source *</Label>
          <Select 
            name="source" 
            value={formData.source} 
            onValueChange={(value) => handleSelectChange("source", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select source" />
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
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <RadioGroup 
            defaultValue="Active" 
            value={formData.status} 
            onValueChange={(value) => handleSelectChange("status", value)}
            className="flex space-x-4"
          >
            {statusOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label htmlFor="total_value">Total Value</Label>
          <Input 
            id="total_value" 
            name="total_value" 
            type="number" 
            placeholder="Total Value" 
            value={formData.total_value} 
            onChange={handleInputChange} 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea 
          id="notes" 
          name="notes" 
          placeholder="Notes" 
          value={formData.notes} 
          onChange={handleInputChange} 
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Create Customer</Button>
      </div>
    </form>
  )
}

export default function CustomersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: customers = [], loading, create } = useOptimizedData({
    table: "customers"
  })
  const { user } = useAuth()
  const { toast } = useToast()

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
        phone: formData.phone,
        city: formData.city,
        country: formData.country,
        source: formData.source,  // Fixed: database expects 'source', not 'contact_source'
        status: formData.status,
        address: formData.address,
        user_id: user.id  // Ensure this matches auth.uid() exactly
      }

      // Create new customer
      const result = await create('customers', customerData)

      if (result) {
        toast({ title: "Success", description: "Customer created successfully!", variant: "default" });
        setIsDialogOpen(false)
      }
    } catch (error) {
      console.error("Error creating customer:", error)
      toast({ title: "Error creating customer", description: error.message || 'An unexpected error occurred', variant: "destructive" })
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">
            Manage your customer relationships and contact information.
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
              {customers.length} after filtering
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
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
          <CustomerForm 
            onSubmit={handleSubmit} 
            onCancel={() => setIsDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
