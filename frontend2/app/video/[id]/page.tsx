'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { videoAPI, commentAPI, likeAPI, subscriptionAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, Share2, Bell, BellOff } from 'lucide-react';
import CommentList from '@/components/CommentList';
import { toast } from 'sonner';

export default function VideoPage() {
  const params = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState<any>(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchVideo();
      fetchComments();
    }
  }, [params.id]);

  const fetchVideo = async () => {
    try {
      const response = await videoAPI.getVideoById(params.id as string);
      setVideo(response.data);
    } catch (error) {
      toast.error('Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentAPI.getVideoComments(params.id as string);
      setComments(response.data.docs);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleLike = async () => {
    try {
      await likeAPI.toggleVideoLike(params.id as string);
      setIsLiked(!isLiked);
      toast.success(isLiked ? 'Like removed' : 'Video liked');
    } catch (error) {
      toast.error('Failed to like video');
    }
  };

  const handleSubscribe = async () => {
    try {
      await subscriptionAPI.toggleSubscription(video.owner._id);
      setIsSubscribed(!isSubscribed);
      toast.success(isSubscribed ? 'Unsubscribed' : 'Subscribed');
    } catch (error) {
      toast.error('Failed to subscribe');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await commentAPI.addComment(params.id as string, newComment);
      setNewComment('');
      fetchComments();
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!video) {
    return <div className="flex justify-center items-center h-screen">Video not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
          <video
            src={video.videoFile}
            controls
            className="w-full h-full"
            poster={video.thumbnail}
          />
        </div>

        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <img
              src={video.owner?.avatar}
              alt={video.owner?.fullName}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold">{video.owner?.fullName}</p>
              <p className="text-sm text-gray-600">{video.views} views</p>
            </div>
            {user && user._id !== video.owner._id && (
              <Button onClick={handleSubscribe} variant={isSubscribed ? 'outline' : 'default'}>
                {isSubscribed ? <BellOff className="w-4 h-4 mr-2" /> : <Bell className="w-4 h-4 mr-2" />}
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleLike} variant="outline">
              <ThumbsUp className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              Like
            </Button>
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4 mb-8">
          <p className="whitespace-pre-wrap">{video.description}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Comments ({comments.length})</h2>

          {user && (
            <form onSubmit={handleAddComment} className="mb-6">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="mb-2"
              />
              <Button type="submit">Comment</Button>
            </form>
          )}

          <CommentList comments={comments} onUpdate={fetchComments} />
        </div>
      </div>
    </div>
  );
}