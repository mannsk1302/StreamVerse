"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { getComments, addComment, deleteComment, updateComment, toggleCommentLike } from "@/lib/api"
import { ThumbsUp, Trash2, Edit2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Comment {
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

interface CommentSectionProps {
  videoId: string
}

export default function CommentSection({ videoId }: CommentSectionProps) {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  useEffect(() => {
    fetchComments()
  }, [videoId])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const data = await getComments(videoId)
      setComments(data.data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      setSubmitting(true)
      await addComment(videoId, newComment)
      setNewComment("")
      await fetchComments()
      toast({
        title: "Success",
        description: "Comment added",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateComment = async (commentId: string) => {
    if (!editText.trim()) return

    try {
      await updateComment(commentId, editText)
      setEditingId(null)
      setEditText("")
      await fetchComments()
      toast({
        title: "Success",
        description: "Comment updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update comment",
        variant: "destructive",
      })
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId)
      await fetchComments()
      toast({
        title: "Success",
        description: "Comment deleted",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      })
    }
  }

  const handleLikeComment = async (commentId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to like comments",
      })
      return
    }

    try {
      await toggleCommentLike(commentId)
      await fetchComments()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like comment",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Comments ({comments.length})</h2>

      {isAuthenticated && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {user?.avatar && (
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.username}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setNewComment("")} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleAddComment} disabled={submitting || !newComment.trim()}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Comment"
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <Card key={comment._id} className="p-4 border-border">
              <div className="flex items-start gap-3">
                {comment.owner.avatar && (
                  <img
                    src={comment.owner.avatar || "/placeholder.svg"}
                    alt={comment.owner.username}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground text-sm">{comment.owner.username}</p>
                    {user?._id === comment.owner._id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(comment._id)
                            setEditText(comment.content)
                          }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {editingId === comment._id ? (
                    <div className="space-y-2 mt-2">
                      <Input value={editText} onChange={(e) => setEditText(e.target.value)} className="text-sm" />
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => handleUpdateComment(comment._id)}>
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-foreground mt-1">{comment.content}</p>
                  )}

                  <div className="flex items-center gap-4 mt-2">
                    <button
                      onClick={() => handleLikeComment(comment._id)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <ThumbsUp className="w-4 h-4" fill={comment.isLiked ? "currentColor" : "none"} />
                      {comment.likesCount || 0}
                    </button>
                    <p className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
