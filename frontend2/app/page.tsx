'use client';

import { useEffect, useState } from 'react';
import { videoAPI } from '@/lib/api';
import VideoCard from '@/components/VideoCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function Home() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, [page, searchQuery]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ API call
      const response = await videoAPI.getAllVideos({
        page,
        limit: 12,
        query: searchQuery,
        sortBy: 'createdAt',
        sortType: 'desc',
      });

      // ✅ Safely access response data
      const videoList = response?.data?.docs || response?.data || [];
      setVideos(videoList);
    } catch (error: any) {
      console.error('Failed to fetch videos:', error);
      setError(error.message || 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchVideos();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">StreamVerse</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </form>
      </div>

      {/* ✅ Error message if API fails */}
      {error && (
        <div className="text-center text-red-500 font-medium mb-6">
          {error}
        </div>
      )}

      {/* ✅ Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 aspect-video rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* ✅ Videos Grid */}
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video: any) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No videos found</p>
            </div>
          )}

          {/* ✅ Pagination Controls */}
          <div className="flex justify-center gap-2 mt-8">
            <Button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              variant="outline"
            >
              Previous
            </Button>
            <span className="px-4 py-2">Page {page}</span>
            <Button
              onClick={() => setPage(page + 1)}
              disabled={videos.length < 12}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}