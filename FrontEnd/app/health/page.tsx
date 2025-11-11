"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { checkHealth } from "@/lib/api"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface HealthStatus {
  status: string
  message?: string
}

export default function HealthPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        setLoading(true)
        const data = await checkHealth()
        setHealth(data)
      } catch (error) {
        setHealth({
          status: "error",
          message: "Failed to connect to API",
        })
      } finally {
        setLoading(false)
      }
    }

    checkApiHealth()
    const interval = setInterval(checkApiHealth, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const isHealthy = health?.status === "ok" || health?.status === "success"

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="p-8 border-border">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-6">API Health Check</h1>

              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">Checking...</span>
                </div>
              ) : (
                <div className="text-center">
                  {isHealthy ? (
                    <>
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h2 className="text-xl font-semibold text-foreground mb-2">API is Healthy</h2>
                      <p className="text-muted-foreground">All systems operational</p>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                      <h2 className="text-xl font-semibold text-foreground mb-2">API is Down</h2>
                      <p className="text-muted-foreground">{health?.message || "Unable to connect"}</p>
                    </>
                  )}

                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      Status: <span className="font-mono">{health?.status}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
