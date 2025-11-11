"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getSubscriptions, toggleSubscription } from "@/lib/api"
import { Loader2, BellOff } from "lucide-react"

interface Channel {
  _id: string
  username: string
  avatar?: string
  subscribersCount?: number
}

export default function SubscriptionsPage() {
  return (
    <ProtectedRoute>
      <SubscriptionsContent />
    </ProtectedRoute>
  )
}

function SubscriptionsContent() {
  const { toast } = useToast()
  const [subscriptions, setSubscriptions] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)
  const [unsubscribing, setUnsubscribing] = useState<string | null>(null)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const data = await getSubscriptions()
      setSubscriptions(data.data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load subscriptions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUnsubscribe = async (channelId: string) => {
    try {
      setUnsubscribing(channelId)
      await toggleSubscription(channelId)
      setSubscriptions(subscriptions.filter((s) => s._id !== channelId))
      toast({
        title: "Success",
        description: "Unsubscribed",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unsubscribe",
        variant: "destructive",
      })
    } finally {
      setUnsubscribing(null)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Subscriptions ({subscriptions.length})</h1>

        {subscriptions.length === 0 ? (
          <Card className="p-12 text-center border-border">
            <p className="text-muted-foreground">You haven't subscribed to any channels yet</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {subscriptions.map((channel) => (
              <Card key={channel._id} className="p-4 flex items-center justify-between border-border">
                <div className="flex items-center gap-4">
                  {channel.avatar && (
                    <img
                      src={channel.avatar || "/placeholder.svg"}
                      alt={channel.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground">{channel.username}</h3>
                    <p className="text-xs text-muted-foreground">{channel.subscribersCount || 0} subscribers</p>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleUnsubscribe(channel._id)}
                  disabled={unsubscribing === channel._id}
                  className="gap-2"
                >
                  {unsubscribing === channel._id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      <BellOff className="w-4 h-4" />
                      Unsubscribe
                    </>
                  )}
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
