"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

interface Video {
  _id: string
  title: string
  thumbnail?: string
  uploaderName: string
}

export default function VideoGrid({ videos }: { videos: Video[] }) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No videos found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {videos.map((video) => (
        <Card key={video._id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative bg-muted aspect-video flex items-center justify-center group cursor-pointer">
            {video.thumbnail ? (
              <img
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-muted-foreground">
                <Play className="w-12 h-12 mx-auto" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                asChild
              >
                <Link href={`/videos/${video._id}`}>
                  <Play className="w-8 h-8 fill-white" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="p-3">
            <h3 className="font-semibold text-sm line-clamp-2 text-foreground mb-1">{video.title}</h3>
            <p className="text-xs text-muted-foreground">{video.uploaderName}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
