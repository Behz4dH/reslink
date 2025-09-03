import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { PlayIcon, DownloadIcon, UserIcon, BriefcaseIcon, ArrowLeftIcon, LogOutIcon, LinkedinIcon } from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Reslink } from '../types/reslink';

interface PublicReslinkPageProps {}

export const PublicReslinkPage = ({}: PublicReslinkPageProps) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [reslink, setReslink] = useState<Reslink | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchReslinkBySlug(slug);
    }
  }, [slug]);

  const fetchReslinkBySlug = async (slug: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/reslinks/public/${slug}`);
      if (!response.ok) {
        throw new Error('Reslink not found');
      }
      const data = await response.json();
      setReslink(data.reslink);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reslink');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayVideo = () => {
    if (reslink?.video_url) {
      window.open(reslink.video_url, '_blank');
    }
  };

  const handleDownloadResume = () => {
    if (reslink?.resume_url) {
      const link = document.createElement('a');
      link.href = reslink.resume_url;
      link.download = `${reslink.name}-resume.pdf`;
      link.click();
    }
  };

  const handleLinkedInClick = () => {
    if (reslink?.linkedin_url) {
      window.open(reslink.linkedin_url, '_blank');
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !reslink) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">{error || 'Reslink not found'}</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 w-full h-20 px-10 flex items-center justify-between z-10 bg-gradient-to-br from-slate-800 to-slate-900">
        <Button 
          variant="outline" 
          onClick={handleBackToDashboard}
          className="border-white text-white bg-transparent hover:bg-white hover:text-slate-900"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <Badge className="bg-white text-slate-900 hover:bg-white/90 px-4 py-2">
                <UserIcon className="h-4 w-4 mr-2" />
                {user.username}
              </Badge>
              <Button 
                variant="outline" 
                onClick={logout}
                className="border-white text-white bg-transparent hover:bg-white hover:text-slate-900"
              >
                <LogOutIcon className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-8 md:px-16 lg:px-20 xl:px-24 py-6">
        {/* Profile Section */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
          {/* Left Section - Avatar and Info */}
          <div className="flex flex-col sm:flex-row lg:flex-row items-center gap-6 lg:gap-8">
            {/* Avatar */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
              {reslink.avatar_url ? (
                <img 
                  src={reslink.avatar_url} 
                  alt={`${reslink.name} Avatar`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-600">
                    {getInitials(reslink.name)}
                  </span>
                </div>
              )}
            </div>

            {/* Name and Job Info */}
            <div className="flex flex-col gap-3 text-center sm:text-left lg:text-left">
              {/* Name - First Row */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase font-bold text-white tracking-wider">
                {reslink.name}
              </h1>

              {/* Title: Position - Company - Second Row */}
              <div className="flex items-center gap-3 justify-center sm:justify-start lg:justify-start">
                <BriefcaseIcon className="h-5 w-5 text-blue-400" />
                <span className="text-white text-lg font-medium">
                  {reslink.title}
                </span>
              </div>

              {/* LinkedIn Button - Third Row */}
              {reslink?.linkedin_url && (
                <div className="flex justify-center sm:justify-start lg:justify-start">
                  <Button 
                    onClick={handleLinkedInClick}
                    variant="outline"
                    size="sm"
                    className="w-fit border-blue-400 text-blue-400 bg-transparent hover:bg-blue-400 hover:text-slate-900 font-semibold"
                  >
                    <LinkedinIcon className="h-4 w-4 mr-2" />
                    LinkedIn Profile
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex flex-col gap-4 w-full sm:w-auto lg:ml-auto">
            <Button 
              onClick={handlePlayVideo}
              disabled={!reslink.video_url}
              className="w-full sm:w-72 h-14 bg-lime-400 text-slate-900 hover:bg-lime-500 text-lg font-semibold rounded-xl"
            >
              <PlayIcon className="h-5 w-5 mr-3" />
              Play Reslink
            </Button>

            <Button 
              onClick={handleDownloadResume}
              disabled={!reslink.resume_url}
              variant="secondary"
              className="w-full sm:w-72 h-14 bg-slate-700 text-white hover:bg-slate-600 text-lg font-semibold rounded-xl"
            >
              <DownloadIcon className="h-5 w-5 mr-3" />
              Download Resume
            </Button>
          </div>
        </div>
      </main>

      {/* PDF Viewer Section */}
      <section className="px-10 pb-10">
        <div className="w-full h-screen bg-white rounded-t-xl shadow-2xl">
          {reslink.resume_url ? (
            <iframe
              src={`${reslink.resume_url}#toolbar=1&navpanes=1&scrollbar=1&page=1&zoom=FitH`}
              className="w-full h-full rounded-t-xl"
              title={`${reslink.name} Resume`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-t-xl">
              <div className="text-center">
                <div className="text-gray-400 text-xl mb-2">📄</div>
                <p className="text-gray-500">No resume available</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};