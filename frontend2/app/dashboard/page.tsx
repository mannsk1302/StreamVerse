'use client';

import {useEffect, useState} from 'react';
import {useAuth} from '@/contexts/AuthContext';
import {useRouter} from 'next/navigation';
import {dashboardAPI} from '@/lib/api';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Video, Eye, ThumbsUp, Users} from 'lucide-react';
import VideoCard from '@/components/VideoCard';

export default function DashboardPage() {
    const {user, loading: authLoading} = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return; // wait for auth to load

        if (!user) {
            router.push('/auth/login');
            return;
        }

        if (user?._id) {
            fetchDashboardData(user._id);
        }
    }, [user, authLoading]);

    const fetchDashboardData = async (userId: string) => {
        try {
            setLoading(true);

            // ✅ Run both APIs together
            const [statsRes, videosRes] = await Promise.all([
                dashboardAPI.getChannelStats(),
                dashboardAPI.getChannelVideos(userId),
            ]);

            setStats(statsRes?.data || {});
            setVideos(videosRes?.data?.videos || []);
        } catch (error) {
            console.error("🚨 Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || authLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
                        <Video className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalVideos || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalViews || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                        <ThumbsUp className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalLikes || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalSubscribers || 0}</div>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Your Videos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {videos.map((video: any) => (
                        <VideoCard key={video._id} video={video} showActions/>
                    ))}
                </div>
            </div>
        </div>
    );
}