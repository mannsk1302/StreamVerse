"use client"

import { Card } from "@/components/ui/card"

interface Video {
  _id: string
  title: string
  description?: string
  url?: string
  uploaderName: string
}

export default function VideoPlayer({ video }: { video: Video }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="overflow-hidden mb-6">
          <div className="bg-black aspect-video flex items-center justify-center">
            {video.url ? (
              <video controls className="w-full h-full" src={video.url} />
            ) : (
              <div className="text-white text-center">
                <p>Video file not available</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">{video.title}</h1>
          <p className="text-muted-foreground mb-4">
            Uploaded by <span className="font-semibold text-foreground">{video.uploaderName}</span>
          </p>

          {video.description && (
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-foreground text-sm whitespace-pre-wrap">{video.description}</p>
            </div>
          )}
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="p-6 sticky top-20">
          <h3 className="font-semibold text-foreground mb-4">Video Details</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Video ID</p>
              <p className="text-foreground font-mono text-xs break-all">{video._id}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
