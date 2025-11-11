"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import VideoGrid from "@/components/video-grid"
import { getVideos } from "@/lib/api"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        const data = await getVideos()
        setVideos(data)
        setError("")
      } catch (err) {
        setError("Failed to load videos")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {error && <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-8">{error}</div>}

        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <VideoGrid videos={videos} />
        )}
      </div>
    </main>
  )
}
