"use client"

import { createContext, useContext, useState } from "react"

type Language = "en" | "ar"

type Translations = {
  [key: string]: {
    en: string
    ar: string
  }
}

const translations: Translations = {
  // Auth & General
  "Welcome to Nawras CRM": {
    en: "Welcome to Nawras CRM",
    ar: "مرحباً بكم في نظام إدارة علاقات العملاء نورس"
  },
  "Sign in to your account or create a new one": {
    en: "Sign in to your account or create a new one",
    ar: "قم بتسجيل الدخول إلى حسابك أو إنشاء حساب جديد"
  },
  "Email": {
    en: "Email",
    ar: "البريد الإلكتروني"
  },
  "Password": {
    en: "Password",
    ar: "كلمة المرور"
  },
  "Sign In": {
    en: "Sign In",
    ar: "تسجيل الدخول"
  },
  "Sign Up": {
    en: "Sign Up",
    ar: "إنشاء حساب"
  },
  "Back to Home": {
    en: "Back to Home",
    ar: "العودة للرئيسية"
  },
  "Error": {
    en: "Error",
    ar: "خطأ"
  },
  "Success": {
    en: "Success",
    ar: "نجاح"
  },
  "Loading...": {
    en: "Loading...",
    ar: "جاري التحميل..."
  },

  // Navigation
  "nav.administration": {
    en: "Administration",
    ar: "الإدارة"
  },
  "nav.settings": {
    en: "Settings",
    ar: "الإعدادات"
  },
  "nav.userManagement": {
    en: "User Management",
    ar: "إدارة المستخدمين"
  },

  // Roles
  "roles.administrator": {
    en: "Administrator",
    ar: "مدير النظام"
  },
  "roles.manager": {
    en: "Manager",
    ar: "مدير"
  },
  "roles.user": {
    en: "User",
    ar: "مستخدم"
  },
  "Sign Out": {
    en: "Sign Out",
    ar: "تسجيل الخروج"
  },
  "Account": {
    en: "Account",
    ar: "الحساب"
  },

  // Navigation Groups
  "Main": {
    en: "Main",
    ar: "الرئيسية"
  },
  "Sales": {
    en: "Sales",
    ar: "المبيعات"
  },
  "Operations": {
    en: "Operations",
    ar: "العمليات"
  },
  "Analytics": {
    en: "Analytics",
    ar: "التحليلات"
  },
  "Finance": {
    en: "Finance",
    ar: "المالية"
  },
  "Administration": {
    en: "Administration",
    ar: "الإدارة"
  },

  // Navigation Items
  "Dashboard": {
    en: "Dashboard",
    ar: "لوحة التحكم"
  },
  "Customers": {
    en: "Customers",
    ar: "العملاء"
  },
  "Deals": {
    en: "Deals",
    ar: "الصفقات"
  },
  "Proposals": {
    en: "Proposals",
    ar: "العروض"
  },
  "Tasks": {
    en: "Tasks",
    ar: "المهام"
  },
  "Leads": {
    en: "Leads",
    ar: "العملاء المحتملون"
  },
  "Projects": {
    en: "Projects",
    ar: "المشاريع"
  },
  "Reports": {
    en: "Reports",
    ar: "التقارير"
  },
  "Expenses": {
    en: "Expenses",
    ar: "المصروفات"
  },
  "Invoices": {
    en: "Invoices",
    ar: "الفواتير"
  },
  "Payment": {
    en: "Payment",
    ar: "الدفع"
  },
  "Estimates": {
    en: "Estimates",
    ar: "التقديرات"
  },
  "Settings": {
    en: "Settings",
    ar: "الإعدادات"
  },
  "Support": {
    en: "Support",
    ar: "الدعم"
  },
  "User Management": {
    en: "User Management",
    ar: "إدارة المستخدمين"
  },
  "System Reports": {
    en: "System Reports",
    ar: "تقارير النظام"
  },
  "Data Overview": {
    en: "Data Overview",
    ar: "نظرة عامة على البيانات"
  },
  "Admin Panel": {
    en: "Admin Panel",
    ar: "لوحة الإدارة"
  },
  "Admin Dashboard": {
    en: "Admin Dashboard",
    ar: "لوحة تحكم الإدارة"
  },
  "Team Reports": {
    en: "Team Reports",
    ar: "تقارير الفريق"
  },

  // Descriptions
  "Overview and metrics": {
    en: "Overview and metrics",
    ar: "نظرة عامة ومقاييس"
  },
  "Customer management": {
    en: "Customer management",
    ar: "إدارة العملاء"
  },
  "Sales pipeline": {
    en: "Sales pipeline",
    ar: "خط أنابيب المبيعات"
  },
  "Client proposals": {
    en: "Client proposals",
    ar: "عروض العملاء"
  },
  "Task management": {
    en: "Task management",
    ar: "إدارة المهام"
  },
  "Lead tracking": {
    en: "Lead tracking",
    ar: "تتبع العملاء المحتملين"
  },
  "Project management": {
    en: "Project management",
    ar: "إدارة المشاريع"
  },
  "Business reports": {
    en: "Business reports",
    ar: "تقارير الأعمال"
  },
  "Expense tracking": {
    en: "Expense tracking",
    ar: "تتبع المصروفات"
  },
  "Invoice management": {
    en: "Invoice management",
    ar: "إدارة الفواتير"
  },
  "Payment processing": {
    en: "Payment processing",
    ar: "معالجة المدفوعات"
  },
  "Project estimates": {
    en: "Project estimates",
    ar: "تقديرات المشاريع"
  },
  "Help center": {
    en: "Help center",
    ar: "مركز المساعدة"
  },
  "Account settings": {
    en: "Account settings",
    ar: "إعدادات الحساب"
  },
  "Manage system users": {
    en: "Manage system users",
    ar: "إدارة مستخدمي النظام"
  },
  "System-wide analytics": {
    en: "System-wide analytics",
    ar: "تحليلات على مستوى النظام"
  },
  "All system data": {
    en: "All system data",
    ar: "جميع بيانات النظام"
  },
  "System administration": {
    en: "System administration",
    ar: "إدارة النظام"
  },
  "Team performance": {
    en: "Team performance",
    ar: "أداء الفريق"
  }
}

type LanguageContextType = {
  language: Language
  toggleLanguage: () => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  toggleLanguage: () => {},
  t: (key: string) => key,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"))
  }

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      <div dir={language === "ar" ? "rtl" : "ltr"}>
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
} 