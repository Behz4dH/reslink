import { useState } from 'react';
import { PlayIcon, DownloadIcon } from 'lucide-react';
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

interface Reslink {
  id: string;
  title: string;
  name: string;
  position: string;
  company: string;
  createdDate: string;
  videoUrl: string;
  resumeUrl: string;
  status: 'active' | 'draft' | 'completed';
}

interface SimpleReslinksTableProps {
  data: Reslink[];
}

export function SimpleReslinksTable({ data }: SimpleReslinksTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredData = data.filter(reslink => {
    const matchesSearch = reslink.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reslink.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reslink.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || reslink.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleVideoPlay = (videoUrl: string) => {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
  };

  const handleResumeDownload = (resumeUrl: string, name: string) => {
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = `${name}-resume.pdf`;
    link.click();
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default' as const,
      draft: 'secondary' as const,
      completed: 'outline' as const,
    };
    const colors = {
      active: 'bg-green-100 text-green-800 hover:bg-green-100',
      draft: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      completed: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    };
    return (
      <Badge 
        variant={variants[status as keyof typeof variants]} 
        className={colors[status as keyof typeof colors]}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Search and Filters */}
      <div className="p-6 border-b border-gray-200">
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
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
            {filteredData.map((reslink) => (
              <TableRow key={reslink.id}>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">{reslink.name}</div>
                    <div className="text-sm text-muted-foreground">{reslink.position} - {reslink.company}</div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(reslink.createdDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {getStatusBadge(reslink.status)}
                </TableCell>
                <TableCell>
                  {reslink.videoUrl ? (
                    <Button
                      onClick={() => handleVideoPlay(reslink.videoUrl)}
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
                    onClick={() => handleResumeDownload(reslink.resumeUrl, reslink.name)}
                    variant="outline"
                    size="sm"
                    className="h-8"
                  >
                    <DownloadIcon className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
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