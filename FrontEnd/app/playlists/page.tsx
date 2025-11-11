"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { getPlaylists, createPlaylist } from "@/lib/api"
import { Loader2, Plus, Play } from "lucide-react"
import Link from "next/link"

interface Playlist {
  _id: string
  name: string
  description?: string
  videos?: any[]
  videoCount?: number
  owner: {
    _id: string
    username: string
  }
}

export default function PlaylistsPage() {
  return (
    <ProtectedRoute>
      <PlaylistsContent />
    </ProtectedRoute>
  )
}

function PlaylistsContent() {
  const { toast } = useToast()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newPlaylist, setNewPlaylist] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const fetchPlaylists = async () => {
    try {
      setLoading(true)
      const data = await getPlaylists()
      setPlaylists(data.data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load playlists",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlaylist = async () => {
    if (!newPlaylist.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a playlist name",
        variant: "destructive",
      })
      return
    }

    try {
      setCreating(true)
      await createPlaylist(newPlaylist.name, newPlaylist.description)
      setNewPlaylist({ name: "", description: "" })
      await fetchPlaylists()
      toast({
        title: "Success",
        description: "Playlist created",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create playlist",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Playlists</h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Playlist
              </Button>
            </DialogTrigger>
            <DialogContent className="border-border">
              <DialogHeader>
                <DialogTitle>Create New Playlist</DialogTitle>
                <DialogDescription>Add a name and description for your new playlist</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Playlist Name</label>
                  <Input
                    placeholder="My awesome playlist"
                    value={newPlaylist.name}
                    onChange={(e) =>
                      setNewPlaylist({
                        ...newPlaylist,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description (Optional)</label>
                  <textarea
                    placeholder="Add a description..."
                    value={newPlaylist.description}
                    onChange={(e) =>
                      setNewPlaylist({
                        ...newPlaylist,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-20"
                  />
                </div>
                <Button onClick={handleCreatePlaylist} disabled={creating} className="w-full">
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Playlist"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Playlists Grid */}
        {playlists.length === 0 ? (
          <Card className="p-12 text-center border-border">
            <p className="text-muted-foreground mb-4">You don't have any playlists yet</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Your First Playlist
                </Button>
              </DialogTrigger>
              <DialogContent className="border-border">
                <DialogHeader>
                  <DialogTitle>Create New Playlist</DialogTitle>
                  <DialogDescription>Add a name and description for your new playlist</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Playlist Name</label>
                    <Input
                      placeholder="My awesome playlist"
                      value={newPlaylist.name}
                      onChange={(e) =>
                        setNewPlaylist({
                          ...newPlaylist,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Description (Optional)</label>
                    <textarea
                      placeholder="Add a description..."
                      value={newPlaylist.description}
                      onChange={(e) =>
                        setNewPlaylist({
                          ...newPlaylist,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-20"
                    />
                  </div>
                  <Button onClick={handleCreatePlaylist} disabled={creating} className="w-full">
                    {creating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Playlist"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((playlist) => (
              <Link key={playlist._id} href={`/playlists/${playlist._id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-border">
                  <div className="relative bg-muted aspect-video flex items-center justify-center">
                    <Play className="w-12 h-12 text-muted-foreground" />
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {playlist.videos?.length || 0} videos
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground line-clamp-2 mb-2">{playlist.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{playlist.owner.username}</p>
                    {playlist.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{playlist.description}</p>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
