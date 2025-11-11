"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import LoginForm from "@/components/login-form"
import { getToken } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home if already logged in
    if (getToken()) {
      router.push("/")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
