import { useState } from 'react';
import { PlayIcon, DownloadIcon, LoaderIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { Reslink } from '../../types/reslink';


interface SimpleReslinksTableProps {
  data: Reslink[];
  loading?: boolean;
  error?: string | null;
}

export function SimpleReslinksTable({ data, loading, error }: SimpleReslinksTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredData = data.filter(reslink => {
    const matchesSearch = reslink.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reslink.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reslink.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || reslink.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleVideoPlay = (videoUrl: string | undefined) => {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
  };

  const handleResumeDownload = (resumeUrl: string | undefined, name: string) => {
    if (resumeUrl) {
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = `${name}-resume.pdf`;
      link.click();
    }
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
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      {/* Search and Filters */}
      <div className="p-6 border-b">
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Search reslinks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="viewed">Viewed</SelectItem>
              <SelectItem value="multiple_views">Multiple Views</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Reslink Title</TableHead>
              <TableHead className="font-medium">Created Date</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Video</TableHead>
              <TableHead className="font-medium">Resume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <LoaderIcon className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <div className="text-muted-foreground">Loading reslinks...</div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="text-destructive">{error}</div>
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="text-muted-foreground">No reslinks found</div>
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((reslink) => (
                <TableRow key={reslink.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{reslink.name}</div>
                      <div className="text-sm text-muted-foreground">{reslink.position} - {reslink.company}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {reslink.created_date ? new Date(reslink.created_date).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(reslink.status)}
                      {reslink.view_count > 0 && (
                        <span className="text-sm text-muted-foreground">({reslink.view_count} views)</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {reslink.video_url ? (
                      <Button
                        onClick={() => handleVideoPlay(reslink.video_url)}
                        size="sm"
                        className="h-8"
                      >
                        <PlayIcon className="h-3 w-3 mr-1" />
                        Play
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-sm">No video</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleResumeDownload(reslink.resume_url, reslink.name)}
                      variant="outline"
                      size="sm"
                      className="h-8"
                      disabled={!reslink.resume_url}
                    >
                      <DownloadIcon className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-muted/50 border-t">
        <div className="text-sm text-muted-foreground">
          Showing {filteredData.length} of {data.length} reslinks
        </div>
      </div>
    </div>
  );
}