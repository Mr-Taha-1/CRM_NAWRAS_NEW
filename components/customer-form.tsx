"use client"

import { useState, useCallback } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { countries, getCitiesForCountry } from "@/lib/countries"
import type { Database } from "@/lib/supabase"
import {
  CustomerFormData,
  CustomerFormProps,
  FormErrors,
  CONTACT_SOURCES,
  STATUS_OPTIONS,
  ContactSource,
  CustomerStatus
} from "@/app/types/customer"

const INITIAL_DATA: CustomerFormData = {
  contact_person: "",
  email: "",
  phone: undefined,
  company: "",
  country: "",
  city: "",
  source: "Website",
  status: "active",
  notes: undefined
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/ // Basic international phone number format

export function CustomerForm({ onClose, onSubmit, initialData }: CustomerFormProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<CustomerFormData>(initialData || INITIAL_DATA)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableCities, setAvailableCities] = useState<string[]>([])

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {}

    // Required fields validation
    if (!formData.contact_person.trim()) {
      newErrors.contact_person = t("Contact person is required")
    }

    if (!formData.email.trim()) {
      newErrors.email = t("Email is required")
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      newErrors.email = t("Invalid email address")
    }

    if (formData.phone && !PHONE_REGEX.test(formData.phone)) {
      newErrors.phone = t("Invalid phone number format")
    }

    if (!formData.company.trim()) {
      newErrors.company = t("Company is required")
    }

    if (!formData.country.trim()) {
      newErrors.country = t("Country is required")
    }

    if (!formData.city.trim()) {
      newErrors.city = t("City is required")
    }

    if (!formData.source) {
      newErrors.source = t("Contact source is required")
    }

    if (!formData.status) {
      newErrors.status = t("Status is required")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, t])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      // CRITICAL FIX: Debug the form data being submitted
      console.log("🔍 [CUSTOMER-FORM DEBUG] Form data being submitted:", formData)

      // CRITICAL FIX: Map the form data to include the required 'name' field
      const mappedFormData = {
        ...formData,
        name: formData.contact_person  // Map contact_person to name for database compatibility
      }

      console.log("🔍 [CUSTOMER-FORM DEBUG] Mapped form data:", mappedFormData)

      await onSubmit(mappedFormData as any)
      onClose()
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrors(prev => ({
        ...prev,
        submit: t("Failed to submit form. Please try again.")
      }))
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, onSubmit, onClose, validateForm, t])

  const handleChange = useCallback((field: keyof CustomerFormData, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev }
      
      // Handle special cases for optional fields
      if (field === 'phone' || field === 'notes') {
        newData[field] = value || undefined
      }
      // Handle source and status fields
      else if (field === 'source') {
        newData.source = value as ContactSource
      }
      else if (field === 'status') {
        newData.status = value as CustomerStatus
      }
      // Handle all other required string fields
      else {
        newData[field] = value
      }
      
      // Update cities when country changes
      if (field === 'country') {
        const selectedCountry = countries.find(c => c.name === value)
        if (selectedCountry) {
          const cities = getCitiesForCountry(selectedCountry.code)
          setAvailableCities(cities)
          newData.city = '' // Reset city when country changes
        }
      }
      
      return newData
    })
    
    // Clear error when field is edited
    if (field in errors) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }, [errors])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{initialData ? t("Edit Customer") : t("Add Customer")}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_person">{t("Contact Person")} *</Label>
              <Input
                id="contact_person"
                value={formData.contact_person}
                onChange={(e) => handleChange("contact_person", e.target.value)}
                className={errors.contact_person ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.contact_person && (
                <p className="text-sm text-red-500">{errors.contact_person}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("Email")} *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t("Phone")}</Label>
              <Input
                id="phone"
                value={formData.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={errors.phone ? "border-red-500" : ""}
                disabled={isSubmitting}
                placeholder="+1234567890"
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">{t("Company")} *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className={errors.company ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.company && (
                <p className="text-sm text-red-500">{errors.company}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">{t("Country")} *</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => handleChange("country", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={errors.country ? "border-red-500" : ""}>
                  <SelectValue placeholder={t("Select a country")} />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.name}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && (
                <p className="text-sm text-red-500">{errors.country}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">{t("City")} *</Label>
              <Select
                value={formData.city}
                onValueChange={(value) => handleChange("city", value)}
                disabled={isSubmitting || !formData.country}
              >
                <SelectTrigger className={errors.city ? "border-red-500" : ""}>
                  <SelectValue placeholder={t("Select a city")} />
                </SelectTrigger>
                <SelectContent>
                  {availableCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">{t("Contact Source")} *</Label>
              <Select
                value={formData.source}
                onValueChange={(value) => handleChange("source", value as ContactSource)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={errors.source ? "border-red-500" : ""}>
                  <SelectValue placeholder={t("Select a source")} />
                </SelectTrigger>
                <SelectContent>
                  {CONTACT_SOURCES.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.source && (
                <p className="text-sm text-red-500">{errors.source}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{t("Status")} *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value as CustomerStatus)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                  <SelectValue placeholder={t("Select a status")} />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t("Notes")}</Label>
            <Input
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              className={errors.notes ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes}</p>
            )}
          </div>

          {errors.submit && (
            <Alert variant="destructive">
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t("Cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("Saving...") : initialData ? t("Update") : t("Create")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 