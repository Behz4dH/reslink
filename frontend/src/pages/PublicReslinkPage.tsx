import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { PlayIcon, DownloadIcon, UserIcon, BriefcaseIcon, ArrowLeftIcon, LogOutIcon, LinkedinIcon, XIcon } from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '@/contexts/AuthContext';
import ReactPlayer from 'react-player';
import type { Reslink } from '../types/reslink';

interface PublicReslinkPageProps {}

export const PublicReslinkPage = ({}: PublicReslinkPageProps) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [reslink, setReslink] = useState<Reslink | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchReslinkBySlug(slug);
    }
  }, [slug]);

  // Handle Escape key to close video modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showVideoModal) {
        setShowVideoModal(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showVideoModal]);

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
      console.log('Opening video modal with URL:', reslink.video_url);
      console.log('Video URL type:', typeof reslink.video_url);
      console.log('Is valid URL:', reslink.video_url.startsWith('http') || reslink.video_url.startsWith('/'));
      setShowVideoModal(true);
    } else {
      console.log('No video URL available:', reslink?.video_url);
    }
  };

  const handleCloseVideoModal = () => {
    setShowVideoModal(false);
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
              <div className="relative mr-3">
                <div className="w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center animate-pulse hover:animate-none focus:animate-none">
                  <PlayIcon className="h-4 w-4" />
                </div>
              </div>
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

      {/* Video Player Modal */}
      {showVideoModal && reslink?.video_url && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            // Close modal when clicking the backdrop
            if (e.target === e.currentTarget) {
              handleCloseVideoModal();
            }
          }}
        >
          <div className="relative w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden shadow-2xl">
            {/* Close Button */}
            <Button
              onClick={handleCloseVideoModal}
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-20 bg-black bg-opacity-70 hover:bg-opacity-90 text-white border-white border rounded-full w-10 h-10 p-0"
            >
              <XIcon className="h-5 w-5" />
            </Button>
            
            {/* Video Player */}
            <div className="aspect-video bg-black">
              {/* First try direct HTML5 video for WebM files */}
              {reslink.video_url.includes('.webm') ? (
                <video
                  className="w-full h-full"
                  controls
                  autoPlay
                  preload="metadata"
                  onError={(e) => {
                    console.error('Direct HTML5 video error:', e);
                  }}
                  onLoadedData={() => {
                    console.log('Direct HTML5 video loaded successfully');
                  }}
                  onCanPlay={() => {
                    console.log('Video can start playing');
                  }}
                >
                  <source src={reslink.video_url} type="video/webm" />
                  <source src={reslink.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <ReactPlayer
                  url={reslink.video_url}
                  width="100%"
                  height="100%"
                  controls={true}
                  playing={false}
                  pip={true}
                  playsinline={true}
                  config={{
                    file: {
                      attributes: {
                        controlsList: 'nodownload',
                        preload: 'metadata'
                      }
                    }
                  }}
                  onError={(error) => {
                    console.error('ReactPlayer error:', error);
                    console.log('Failed URL:', reslink.video_url);
                  }}
                  onReady={() => {
                    console.log('ReactPlayer ready');
                  }}
                  onStart={() => {
                    console.log('ReactPlayer started');
                  }}
                  onProgress={(progress) => {
                    console.log('Video progress:', progress);
                  }}
                  onDuration={(duration) => {
                    console.log('Video duration:', duration);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};