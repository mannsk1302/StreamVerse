"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, AlertCircle, CheckCircle, Upload } from "lucide-react"
import { uploadVideo } from "@/lib/api"

export default function UploadForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 500 * 1024 * 1024) {
        setError("File size must be less than 500MB")
        return
      }
      setFile(selectedFile)
      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("Video title is required")
      return
    }

    if (!file) {
      setError("Please select a video file")
      return
    }

    try {
      setLoading(true)
      await uploadVideo(file, title, description)
      setSuccess(true)
      setTimeout(() => {
        router.push("/profile")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Upload failed")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="p-6 text-center">
          <div className="mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Video Uploaded!</h2>
            <p className="text-muted-foreground">Your video has been successfully uploaded. Redirecting...</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Upload Video</h1>
          <p className="text-muted-foreground">Share your video with the StreamVerse community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex gap-2 items-start">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Video File *</label>
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              {file ? (
                <div>
                  <p className="font-semibold text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-foreground mb-1">Click to select or drag and drop</p>
                  <p className="text-xs text-muted-foreground">MP4, WebM, or other video formats up to 500MB</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Video Title *</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              disabled={loading}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground mt-1">{title.length}/100</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description (optional)"
              disabled={loading}
              maxLength={500}
              rows={4}
              className="w-full px-3 py-2 bg-input border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
            <p className="text-xs text-muted-foreground mt-1">{description.length}/500</p>
          </div>

          {/* Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Uploading: {uploadProgress}%</p>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading || !file || !title.trim()}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Video"
            )}
          </Button>
        </form>
      </Card>
    </div>
  )
}
