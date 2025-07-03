"use client"

import { create } from "zustand"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: "default" | "destructive"
}

interface ToastStore {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>()((set) => ({
  toasts: [],
  addToast: (toast: Omit<Toast, "id">) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: Math.random().toString(36).substr(2, 9) },
      ],
    })),
  removeToast: (id: string) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))

export function useToast() {
  const { addToast, removeToast } = useToastStore()

  return {
    toast: (props: Omit<Toast, "id">) => {
      addToast(props)
      setTimeout(() => {
        removeToast(props.title)
      }, 5000)
    },
  }
} 