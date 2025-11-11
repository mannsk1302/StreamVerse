"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getDashboardStats, getDashboardVideos } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, Video, Eye, Heart, Users } from "lucide-react"
import VideoGrid from "@/components/video-grid"

interface Stats {
  totalVideos: number
  totalViews: number
  totalLikes: number
  subscribers: number
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [stats, setStats] = useState<Stats | null>(null)
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [statsData, videosData] = await Promise.all([
          getDashboardStats(),
          user?._id ? getDashboardVideos(user._id) : Promise.resolve({ data: [] }),
        ])
        setStats(statsData.data)
        setVideos(videosData.data || [])
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

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
        <h1 className="text-3xl font-bold text-foreground mb-8">Channel Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Videos</p>
                <p className="text-3xl font-bold text-foreground">{stats?.totalVideos || 0}</p>
              </div>
              <Video className="w-8 h-8 text-muted-foreground" />
            </div>
          </Card>

          <Card className="p-6 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Total Views</p>
                <p className="text-3xl font-bold text-foreground">{(stats?.totalViews || 0).toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-muted-foreground" />
            </div>
          </Card>

          <Card className="p-6 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Total Likes</p>
                <p className="text-3xl font-bold text-foreground">{(stats?.totalLikes || 0).toLocaleString()}</p>
              </div>
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
          </Card>

          <Card className="p-6 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Subscribers</p>
                <p className="text-3xl font-bold text-foreground">{(stats?.subscribers || 0).toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </Card>
        </div>

        {/* Videos List */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-6">Your Videos</h2>
          {videos.length === 0 ? (
            <Card className="p-12 text-center border-border">
              <p className="text-muted-foreground">You haven't uploaded any videos yet</p>
            </Card>
          ) : (
            <VideoGrid videos={videos} />
          )}
        </div>
      </div>
    </main>
  )
}
