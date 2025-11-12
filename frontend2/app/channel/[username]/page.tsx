'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { userAPI } from '@/lib/api';
import VideoCard from '@/components/VideoCard';

export default function ChannelPage() {
  const params = useParams();
  const username = Array.isArray(params.username)
    ? params.username[0]
    : params.username;

  const [user, setUser] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🟢 Params:', params);
    console.log('🟢 Username:', username);

    if (username) {
      fetchChannelData(username);
    } else {
      console.warn('⚠️ Username missing in params');
    }
  }, [username]);

  const fetchChannelData = async (uname: string) => {
    try {
      setLoading(true);

      console.log('🔹 Fetching user profile for:', uname);
      const userRes = await userAPI.getUserProfile(uname);
      console.log('✅ User API Response:', userRes);

      const videoRes = await fetch(
        `http://localhost:8000/api/v1/dashboard/videos/${userRes.data._id}`,
        { credentials: 'include' }
      );

      const videoData = await videoRes.json();
      console.log('✅ Video Data:', videoData);

      setUser(userRes.data);
      setVideos(videoData.data?.videos || []);
    } catch (err) {
      console.error('🚨 Error loading channel:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-400">Loading channel...</p>;

  if (!user)
    return <p className="text-center mt-10 text-red-500">Channel not found 😢</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <img
          src={user.avatar || '/default-avatar.png'}
          alt={user.username}
          className="w-20 h-20 rounded-full mr-4"
        />
        <div>
          <h2 className="text-3xl font-bold">{user.fullName || user.username}</h2>
          <p className="text-gray-500">@{user.username}</p>
        </div>
      </div>

      <h3 className="text-2xl font-semibold mb-4">Videos</h3>
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-6">No videos yet 😶</p>
      )}
    </div>
  );
}