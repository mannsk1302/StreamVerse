"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Navbar from "@/components/navbar"
import VideoPlayer from "@/components/video-player"
import { getVideoById } from "@/lib/api"
import { Loader2 } from "lucide-react"

export default function VideoDetailPage() {
  const params = useParams()
  const videoId = params.id as string
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true)
        const data = await getVideoById(videoId)
        setVideo(data)
        setError("")
      } catch (err) {
        setError("Failed to load video")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (videoId) {
      fetchVideo()
    }
  }, [videoId])

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {error && <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-8">{error}</div>}

        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : video ? (
          <VideoPlayer video={video} />
        ) : (
          <div className="text-center text-muted-foreground">Video not found</div>
        )}
      </div>
    </main>
  )
}
