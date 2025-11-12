import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface VideoCardProps {
  video: any;
  showActions?: boolean;
}

export default function VideoCard({ video, showActions }: VideoCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/video/${video._id}`}>
        <div className="relative aspect-video bg-gray-200">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
          </div>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/video/${video._id}`}>
          <h3 className="font-semibold line-clamp-2 mb-2 hover:text-blue-600">
            {video.title}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <img
            src={video.owner?.avatar}
            alt={video.owner?.fullName}
            className="w-8 h-8 rounded-full"
          />
          <div className="text-sm text-gray-600">
            <p className="font-medium">{video.owner?.fullName}</p>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {video.views} views • {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
        </div>
      </CardContent>
    </Card>
  );
}