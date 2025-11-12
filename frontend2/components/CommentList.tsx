import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { commentAPI, likeAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, Edit, Trash } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface CommentListProps {
  comments: any[];
  onUpdate: () => void;
}

export default function CommentList({ comments, onUpdate }: CommentListProps) {
  const { user } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleEdit = (comment: any) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async (commentId: string) => {
    try {
      await commentAPI.updateComment(commentId, editContent);
      setEditingId(null);
      onUpdate();
      toast.success('Comment updated');
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentAPI.deleteComment(commentId);
      onUpdate();
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      await likeAPI.toggleCommentLike(commentId);
      onUpdate();
    } catch (error) {
      toast.error('Failed to like comment');
    }
  };

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment._id} className="flex gap-3">
          <img
            src={comment.owner?.avatar}
            alt={comment.owner?.fullName}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{comment.owner?.fullName}</span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>

            {editingId === comment._id ? (
              <div>
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="mb-2"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSaveEdit(comment._id)}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="mb-2">{comment.content}</p>
                <div className="flex items-center gap-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleLike(comment._id)}
                  >
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    {comment.likes || 0}
                  </Button>

                  {user && user._id === comment.owner._id && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(comment)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(comment._id)}
                      >
                        <Trash className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}