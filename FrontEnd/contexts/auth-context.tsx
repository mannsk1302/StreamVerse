"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { loginUser, registerUser, getCurrentUser, logoutUser } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface User {
  _id: string
  username: string
  email: string
  avatar?: string
  coverImage?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: {
    username: string
    email: string
    password: string
    avatar?: File
  }) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const userData = await getCurrentUser()
          setUser(userData.data)
        } catch (error) {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await loginUser(email, password)
      const token = response.data.accessToken
      const userData = response.data.user

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
      toast({
        title: "Success",
        description: "Logged in successfully",
      })
    } catch (error: any) {
      const message = error.message || "Login failed"
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      throw error
    }
  }

  const register = async (userData: {
    username: string
    email: string
    password: string
    avatar?: File
  }) => {
    try {
      const response = await registerUser(userData)
      const token = response.data.accessToken
      const user = response.data.user

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      setUser(user)
      toast({
        title: "Success",
        description: "Account created successfully",
      })
    } catch (error: any) {
      const message = error.message || "Registration failed"
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      throw error
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setUser(null)
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
