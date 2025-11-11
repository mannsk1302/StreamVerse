"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Menu, X, Play } from "lucide-react"
import { getToken, removeToken } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const token = getToken()

  const handleLogout = () => {
    removeToken()
    router.push("/")
    setIsOpen(false)
  }

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <Play className="w-5 h-5 text-primary-foreground fill-current" />
            </div>
            <span className="hidden sm:inline text-foreground">StreamVerse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {token ? (
              <>
                <Button variant="outline" onClick={() => router.push("/upload")}>
                  Upload
                </Button>
                <Button variant="outline" onClick={() => router.push("/profile")}>
                  Profile
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => router.push("/login")}>
                  Login
                </Button>
                <Button onClick={() => router.push("/register")}>Register</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-2">
            {token ? (
              <>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    router.push("/upload")
                    setIsOpen(false)
                  }}
                >
                  Upload
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    router.push("/profile")
                    setIsOpen(false)
                  }}
                >
                  Profile
                </Button>
                <Button variant="destructive" className="w-full" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    router.push("/login")
                    setIsOpen(false)
                  }}
                >
                  Login
                </Button>
                <Button
                  className="w-full"
                  onClick={() => {
                    router.push("/register")
                    setIsOpen(false)
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
