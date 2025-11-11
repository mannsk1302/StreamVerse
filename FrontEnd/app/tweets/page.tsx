"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getTweets, createTweet, deleteTweet, updateTweet, toggleTweetLike } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, Heart, Trash2, Edit2 } from "lucide-react"

interface Tweet {
  _id: string
  content: string
  owner: {
    _id: string
    username: string
    avatar?: string
  }
  likesCount?: number
  isLiked?: boolean
  createdAt: string
}

export default function TweetsPage() {
  const searchParams = useSearchParams()
  const userId = searchParams.get("user") || ""
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()

  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newTweet, setNewTweet] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  const targetUserId = userId || user?._id

  useEffect(() => {
    if (targetUserId) {
      fetchTweets()
    }
  }, [targetUserId])

  const fetchTweets = async () => {
    if (!targetUserId) return
    try {
      setLoading(true)
      const data = await getTweets(targetUserId)
      setTweets(data.data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tweets",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTweet = async () => {
    if (!newTweet.trim()) return

    try {
      setCreating(true)
      await createTweet(newTweet)
      setNewTweet("")
      await fetchTweets()
      toast({
        title: "Success",
        description: "Tweet posted",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tweet",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  const handleUpdateTweet = async (tweetId: string) => {
    if (!editText.trim()) return

    try {
      await updateTweet(tweetId, editText)
      setEditingId(null)
      setEditText("")
      await fetchTweets()
      toast({
        title: "Success",
        description: "Tweet updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tweet",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTweet = async (tweetId: string) => {
    try {
      await deleteTweet(tweetId)
      await fetchTweets()
      toast({
        title: "Success",
        description: "Tweet deleted",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete tweet",
        variant: "destructive",
      })
    }
  }

  const handleLikeTweet = async (tweetId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to like tweets",
      })
      return
    }

    try {
      await toggleTweetLike(tweetId)
      await fetchTweets()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like tweet",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Tweets</h1>

          {/* Create Tweet - Only show if viewing own tweets and authenticated */}
          {isAuthenticated && (!userId || userId === user?._id) && (
            <Card className="p-4 border-border mb-6">
              <div className="space-y-3">
                <textarea
                  placeholder="What's on your mind?"
                  value={newTweet}
                  onChange={(e) => setNewTweet(e.target.value)}
                  disabled={creating}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-20"
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setNewTweet("")} disabled={creating}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTweet} disabled={creating || !newTweet.trim()}>
                    {creating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post Tweet"
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Tweets List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : tweets.length === 0 ? (
              <Card className="p-8 text-center border-border">
                <p className="text-muted-foreground">
                  No tweets yet. {!userId || userId === user?._id ? "Be the first to tweet!" : ""}
                </p>
              </Card>
            ) : (
              tweets.map((tweet) => (
                <Card key={tweet._id} className="p-4 border-border">
                  <div className="flex items-start gap-3">
                    {tweet.owner.avatar && (
                      <img
                        src={tweet.owner.avatar || "/placeholder.svg"}
                        alt={tweet.owner.username}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-foreground">{tweet.owner.username}</p>
                        {user?._id === tweet.owner._id && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingId(tweet._id)
                                setEditText(tweet.content)
                              }}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTweet(tweet._id)}
                              className="text-destructive hover:text-destructive/80"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {editingId === tweet._id ? (
                        <div className="space-y-2 mt-2">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-16"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                              Cancel
                            </Button>
                            <Button size="sm" onClick={() => handleUpdateTweet(tweet._id)}>
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-foreground mt-1">{tweet.content}</p>
                      )}

                      <div className="flex items-center gap-4 mt-3">
                        <button
                          onClick={() => handleLikeTweet(tweet._id)}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <Heart className="w-4 h-4" fill={tweet.isLiked ? "currentColor" : "none"} />
                          {tweet.likesCount || 0}
                        </button>
                        <p className="text-xs text-muted-foreground">
                          {new Date(tweet.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
