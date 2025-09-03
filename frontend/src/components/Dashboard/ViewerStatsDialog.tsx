import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { LoaderIcon, EyeIcon, UsersIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import { apiService } from '../../services/api';
import type { Reslink } from '../../types/reslink';

interface ViewerStats {
  total_views: number;
  unique_viewers: number;
  last_viewed: string | null;
  views_today: number;
  views_this_week: number;
  views_this_month: number;
}

interface ViewerStatsDialogProps {
  reslink: Reslink;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewerStatsDialog({ reslink, isOpen, onClose }: ViewerStatsDialogProps) {
  const [stats, setStats] = useState<ViewerStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && reslink.id) {
      fetchStats();
    }
  }, [isOpen, reslink.id]);

  const fetchStats = async () => {
    if (!reslink.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getAnalytics(reslink.id);
      console.log('Analytics response:', response);
      setStats(response.stats);
    } catch (err) {
      setError('Failed to load viewer stats');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'secondary' as const,
      published: 'default' as const,
      viewed: 'outline' as const,
      multiple_views: 'destructive' as const,
    };
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <EyeIcon className="h-5 w-5" />
            Viewer Stats
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Reslink Info */}
          <div className="border-b pb-4">
            <h3 className="font-medium">{reslink.name}</h3>
            <p className="text-sm text-muted-foreground">
              {reslink.position} - {reslink.company}
            </p>
            <div className="mt-2">
              {getStatusBadge(reslink.status)}
            </div>
          </div>

          {/* Stats */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoaderIcon className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading stats...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              {error}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <EyeIcon className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.total_views}</p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <UsersIcon className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.unique_viewers}</p>
                  <p className="text-sm text-muted-foreground">Unique Viewers</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <ClockIcon className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.views_today}</p>
                  <p className="text-sm text-muted-foreground">Today</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <CalendarIcon className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.views_this_week}</p>
                  <p className="text-sm text-muted-foreground">This Week</p>
                </div>
              </div>

              <div className="col-span-2 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-1">Last Viewed</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(stats.last_viewed)}
                </p>
              </div>

              <div className="col-span-2 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-1">This Month</p>
                <p className="text-lg font-semibold">{stats.views_this_month} views</p>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}