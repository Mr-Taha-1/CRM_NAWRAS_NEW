// Contact source options with emojis
export const CONTACT_SOURCES = [
  { value: "Website", label: "🌐 Website" },
  { value: "Referral", label: "👥 Referral" },
  { value: "Cold Call", label: "📞 Cold Call" },
  { value: "Social Media", label: "📱 Social Media" },
  { value: "Trade Show", label: "🎪 Trade Show" },
  { value: "Other", label: "📋 Other" }
] as const;

// Status options with emojis
export const STATUS_OPTIONS = [
  { value: "active", label: "🟢 Active" },
  { value: "inactive", label: "⚫ Inactive" },
  { value: "potential", label: "🟡 Potential" }
] as const;

// Type for contact source
export type ContactSource = typeof CONTACT_SOURCES[number]["value"];

// Type for customer status
export type CustomerStatus = typeof STATUS_OPTIONS[number]["value"];

// Form data interface
export interface CustomerFormData {
  contact_person: string;
  email: string;
  phone?: string;
  company: string;
  city: string;
  country: string;
  source: ContactSource;
  status: CustomerStatus;
  notes?: string;
}

// Database schema interface
export interface CustomerDatabaseSchema {
  id: string;
  user_id: string;
  name: string;  // CRITICAL FIX: Add required name field
  contact_person: string;
  email: string;
  phone: string | null;
  company: string;
  city: string;
  country: string;
  contact_source: ContactSource;  // CRITICAL FIX: Correct field name
  status: CustomerStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Form errors interface
export interface FormErrors {
  contact_person?: string;
  email?: string;
  phone?: string;
  company?: string;
  country?: string;
  city?: string;
  source?: string;
  status?: string;
  notes?: string;
  submit?: string;
}

// Form props interface
export interface CustomerFormProps {
  onSubmit: (data: CustomerFormData) => Promise<void>;
  onClose: () => void;
  initialData?: CustomerFormData;
}

// Map form data to database schema
export function mapFormToDatabase(formData: CustomerFormData, userId: string): Omit<CustomerDatabaseSchema, 'id' | 'created_at' | 'updated_at'> {
  // CRITICAL FIX: Debug the mapping process
  console.log("🔍 [MAPPING DEBUG] Input form data:", formData)
  console.log("🔍 [MAPPING DEBUG] User ID:", userId)

  const mappedData = {
    user_id: userId,
    name: formData.contact_person,  // CRITICAL FIX: Map contact_person to required name field
    contact_person: formData.contact_person,  // Keep for compatibility
    email: formData.email,
    phone: formData.phone ?? null,
    company: formData.company,
    city: formData.city,
    country: formData.country,
    contact_source: formData.source,  // CRITICAL FIX: Map to contact_source field
    status: formData.status,
    notes: formData.notes ?? null
  };

  console.log("🔍 [MAPPING DEBUG] Output mapped data:", mappedData)
  return mappedData;
}

// Map database schema to form data
export function mapDatabaseToForm(data: CustomerDatabaseSchema): CustomerFormData {
  return {
    contact_person: data.name || data.contact_person,  // CRITICAL FIX: Use name field as primary
    email: data.email,
    phone: data.phone ?? undefined,
    company: data.company,
    city: data.city,
    country: data.country,
    source: data.contact_source,  // CRITICAL FIX: Use contact_source field
    status: data.status,
    notes: data.notes ?? undefined
  };
}