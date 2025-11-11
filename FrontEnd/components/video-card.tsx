"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Play } from "lucide-react"

interface VideoCardProps {
  _id: string
  title: string
  thumbnail?: string
  owner?: {
    username: string
    avatar?: string
  }
  views?: number
  duration?: number
  createdAt?: string
}

export default function VideoCard({ _id, title, thumbnail, owner, views, duration, createdAt }: VideoCardProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const formatViews = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const formatDate = (date: string) => {
    const now = new Date()
    const then = new Date(date)
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000)

    if (seconds < 60) return "just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return `${Math.floor(seconds / 604800)}w ago`
  }

  return (
    <Link href={`/video/${_id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-card border-border">
        <div className="relative bg-muted aspect-video">
          {thumbnail ? (
            <img src={thumbnail || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Play className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          {duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
              {formatDuration(duration)}
            </div>
          )}
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2">{title}</h3>

          <div className="flex items-center gap-3 mb-2">
            {owner?.avatar && (
              <img
                src={owner.avatar || "/placeholder.svg"}
                alt={owner.username}
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground truncate">{owner?.username || "Unknown"}</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            {views !== undefined && `${formatViews(views)} views`}
            {views !== undefined && createdAt && " • "}
            {createdAt && formatDate(createdAt)}
          </p>
        </div>
      </Card>
    </Link>
  )
}
