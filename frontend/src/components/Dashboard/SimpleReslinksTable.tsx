import { useState } from 'react';
import { PlayIcon, DownloadIcon, LoaderIcon, EyeIcon, BadgeIcon, ExternalLinkIcon } from 'lucide-react';
import { apiService } from '../../services/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ViewerStatsDialog } from './ViewerStatsDialog';
import { getReslinkPublicUrl } from '../../utils/slugUtils';
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
  console.log('🎯 SimpleReslinksTable received:', { data, loading, error, dataLength: data?.length });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [badgeLoading, setBadgeLoading] = useState<number | null>(null);
  const [selectedReslink, setSelectedReslink] = useState<Reslink | null>(null);
  const [showStatsDialog, setShowStatsDialog] = useState(false);

  const filteredData = data?.filter(reslink => {
    const matchesSearch = reslink.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reslink.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reslink.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || reslink.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];
  
  console.log('🔍 Filtered data:', { originalLength: data?.length, filteredLength: filteredData.length, filteredData });

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

  const handleViewReslink = (reslink: Reslink) => {
    if (reslink.position && reslink.company) {
      const url = getReslinkPublicUrl(reslink);
      window.open(url, '_blank');
    }
  };

  const handleAddBadge = async (reslink: Reslink) => {
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf';
    fileInput.style.display = 'none';
    
    fileInput.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        setBadgeLoading(reslink.id);
        
        // Add badge to PDF
        const badgedPdfBlob = await apiService.addBadgeToPDF(reslink.id, file);
        
        // Auto-download the badged resume for user
        const downloadUrl = URL.createObjectURL(badgedPdfBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${reslink.name}-resume-with-reslink-badge.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
        
        // Convert badged PDF blob to File and upload as the resume
        const badgedFile = new File([badgedPdfBlob], `${reslink.name}-resume-badged.pdf`, { type: 'application/pdf' });
        const resumeUploadResult = await apiService.uploadResume(badgedFile);
        const resumeUrl = resumeUploadResult.url;
        
        // Update reslink with badged resume URL
        await apiService.updateReslink(reslink.id, { resume_url: resumeUrl });
        
        // Refresh the page to show updated data
        window.location.reload();
        
      } catch (error) {
        console.error('Error adding badge to PDF:', error);
        alert('Failed to add badge to PDF. Please try again.');
      } finally {
        setBadgeLoading(null);
      }
    };
    
    // Trigger file selection
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  const handleStatusClick = (reslink: Reslink) => {
    setSelectedReslink(reslink);
    setShowStatsDialog(true);
  };

  const getStatusBadge = (status: string, reslink: Reslink) => {
    const variants = {
      draft: 'secondary' as const,
      published: 'default' as const,
      viewed: 'outline' as const,
      multiple_views: 'destructive' as const,
    };
    return (
      <Badge 
        variant={variants[status as keyof typeof variants] || 'secondary'}
        className="cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => handleStatusClick(reslink)}
      >
        {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  return (
    <div className="relative rounded-lg border bg-card text-card-foreground shadow-sm">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <LoaderIcon className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        </div>
      )}
      
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
              <TableHead className="font-medium">Add Badge</TableHead>
              <TableHead className="font-medium">View Reslink</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-destructive">{error}</div>
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
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
                      {getStatusBadge(reslink.status, reslink)}
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
                  <TableCell>
                    <Button
                      onClick={() => handleAddBadge(reslink)}
                      variant="outline"
                      size="sm"
                      className="h-8"
                      disabled={badgeLoading === reslink.id || !reslink.video_url}
                    >
                      {badgeLoading === reslink.id ? (
                        <LoaderIcon className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <BadgeIcon className="h-3 w-3 mr-1" />
                      )}
                      Add Badge
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleViewReslink(reslink)}
                      variant="outline"
                      size="sm"
                      className="h-8"
                      disabled={!reslink.position || !reslink.company}
                    >
                      <ExternalLinkIcon className="h-3 w-3 mr-1" />
                      View Reslink
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

      {/* Viewer Stats Dialog */}
      {selectedReslink && (
        <ViewerStatsDialog
          reslink={selectedReslink}
          isOpen={showStatsDialog}
          onClose={() => {
            setShowStatsDialog(false);
            setSelectedReslink(null);
          }}
        />
      )}
    </div>
  );
}