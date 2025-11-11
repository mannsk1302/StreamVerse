"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle } from "lucide-react"
import { getUserProfile } from "@/lib/api"

interface User {
  username: string
  email: string
  uploadedVideos?: any[]
}

export default function ProfileContent() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const data = await getUserProfile()
        setUser(data)
        setError("")
      } catch (err: any) {
        setError(err.message || "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex gap-2 items-start">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-20">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-1">{user?.username}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>

            <Button className="w-full" asChild>
              <Link href="/upload">Upload Video</Link>
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-foreground mb-4">Uploaded Videos</h3>

            {user?.uploadedVideos && user.uploadedVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.uploadedVideos.map((video) => (
                  <Card key={video._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="bg-muted aspect-video flex items-center justify-center">
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-muted-foreground">No thumbnail</div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold text-sm line-clamp-2 text-foreground mb-2">{video.title}</h4>
                      <Button size="sm" variant="outline" className="w-full bg-transparent" asChild>
                        <Link href={`/videos/${video._id}`}>Watch</Link>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground mb-4">You haven't uploaded any videos yet</p>
                <Button asChild>
                  <Link href="/upload">Upload Your First Video</Link>
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
