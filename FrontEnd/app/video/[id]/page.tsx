"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Navbar from "@/components/navbar"
import VideoPlayer from "@/components/video-player"
import CommentSection from "@/components/comment-section"
import VideoGrid from "@/components/video-grid"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getVideoById, getVideos, toggleVideoLike, toggleSubscription } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { ThumbsUp, ThumbsDown, Share2, Loader2, Bell } from "lucide-react"
import Link from "next/link"

interface Video {
  _id: string
  title: string
  description: string
  videoFile: string
  thumbnail?: string
  views: number
  likesCount: number
  isLiked?: boolean
  owner: {
    _id: string
    username: string
    avatar?: string
  }
  createdAt: string
  duration?: number
}

export default function VideoDetailPage() {
  const params = useParams()
  const videoId = params.id as string
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()

  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [liking, setLiking] = useState(false)
  const [subscribing, setSubscribing] = useState(false)
  const [allVideos, setAllVideos] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [videoData, videosData] = await Promise.all([getVideoById(videoId), getVideos()])
        setVideo(videoData.data)
        setAllVideos((videosData.data || []).filter((v: any) => v._id !== videoId))
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load video",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [videoId])

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to like videos",
      })
      return
    }

    try {
      setLiking(true)
      await toggleVideoLike(videoId)
      await getVideoById(videoId).then((data) => setVideo(data.data))
      toast({
        title: "Success",
        description: video?.isLiked ? "Like removed" : "Video liked",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like video",
        variant: "destructive",
      })
    } finally {
      setLiking(false)
    }
  }

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to subscribe",
      })
      return
    }

    try {
      setSubscribing(true)
      await toggleSubscription(video!.owner._id)
      toast({
        title: "Success",
        description: "Subscription updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      })
    } finally {
      setSubscribing(false)
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

  if (!video) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Video not found</p>
        </div>
      </main>
    )
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <VideoPlayer src={video.videoFile} poster={video.thumbnail} title={video.title} />

            {/* Video Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">{video.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {video.views} views • {formatDate(video.createdAt)}
                </p>
              </div>

              {/* Channel Info */}
              <Card className="p-4 border-border">
                <div className="flex items-center justify-between">
                  <Link href={`/channel/${video.owner._id}`}>
                    <div className="flex items-center gap-3 hover:opacity-80">
                      {video.owner.avatar && (
                        <img
                          src={video.owner.avatar || "/placeholder.svg"}
                          alt={video.owner.username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold text-foreground">{video.owner.username}</h3>
                        <p className="text-xs text-muted-foreground">Channel</p>
                      </div>
                    </div>
                  </Link>

                  <Button
                    onClick={handleSubscribe}
                    disabled={subscribing || user?._id === video.owner._id}
                    className="gap-2"
                  >
                    <Bell className="w-4 h-4" />
                    Subscribe
                  </Button>
                </div>
              </Card>

              {/* Description */}
              <Card className="p-4 border-border">
                <h3 className="font-semibold text-foreground mb-2">Description</h3>
                <p className="text-sm text-foreground whitespace-pre-wrap">{video.description}</p>
              </Card>

              {/* Interaction Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2 bg-transparent" onClick={handleLike} disabled={liking}>
                  <ThumbsUp className="w-4 h-4" fill={video.isLiked ? "currentColor" : "none"} />
                  {video.likesCount}
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <ThumbsDown className="w-4 h-4" />
                  Dislike
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>

              {/* Comments */}
              <CommentSection videoId={videoId} />
            </div>
          </div>

          {/* Sidebar - Recommended Videos */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Recommended</h3>
            <div className="space-y-3">
              {allVideos.slice(0, 5).map((v) => (
                <Link key={v._id} href={`/video/${v._id}`}>
                  <Card className="p-3 hover:shadow-md transition-shadow border-border cursor-pointer">
                    {v.thumbnail && (
                      <img
                        src={v.thumbnail || "/placeholder.svg"}
                        alt={v.title}
                        className="w-full h-24 object-cover rounded mb-2"
                      />
                    )}
                    <h4 className="text-sm font-medium text-foreground line-clamp-2">{v.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{v.owner?.username}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* More Recommended Videos */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-foreground mb-6">More Videos</h2>
          <VideoGrid videos={allVideos.slice(5)} />
        </div>
      </div>
    </main>
  )
}
