import { useState } from 'react';

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
    const colors = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colors[status as keyof typeof colors]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Search and Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search reslinks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reslink Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Video
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resume
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((reslink) => (
              <tr key={reslink.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{reslink.name}</div>
                    <div className="text-sm text-gray-500">{reslink.position} - {reslink.company}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {new Date(reslink.createdDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(reslink.status)}
                </td>
                <td className="px-6 py-4">
                  {reslink.videoUrl ? (
                    <button
                      onClick={() => handleVideoPlay(reslink.videoUrl)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Play
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">No video</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleResumeDownload(reslink.resumeUrl, reslink.name)}
                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Showing {filteredData.length} of {data.length} reslinks
        </div>
      </div>
    </div>
  );
}