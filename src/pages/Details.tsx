
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MediaDetails, getMediaDetails, getImageUrl, getRecommendations, Media } from '@/utils/api';
import Navbar from '@/components/Navbar';
import MediaGrid from '@/components/MediaGrid';
import { Button } from '@/components/ui/button';
import { Play, Calendar, Clock, Star } from 'lucide-react';
import Loader from '@/components/Loader';
import WatchlistButton from '@/components/WatchlistButton';

const Details: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [recommendations, setRecommendations] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!type || !id) return;
    
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [detailsData, recommendationsData] = await Promise.all([
          getMediaDetails(id, type as 'movie' | 'tv'),
          getRecommendations(id, type as 'movie' | 'tv')
        ]);
        
        setDetails(detailsData);
        setRecommendations(recommendationsData.results.slice(0, 12));
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };

    window.scrollTo(0, 0);
    fetchDetails();
  }, [type, id]);

  const handleWatch = () => {
    if (type && id) {
      navigate(`/watch/${type}/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex justify-center items-center h-[70vh]">
          <Loader size="large" />
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold">Details not found</h1>
          <Button 
            onClick={() => navigate('/')}
            className="mt-4"
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const backdropUrl = getImageUrl(details.backdrop_path, 'original');
  const posterUrl = getImageUrl(details.poster_path, 'w500');
  const title = details.title || details.name || '';
  const year = details.release_date || details.first_air_date 
    ? new Date(details.release_date || details.first_air_date || '').getFullYear() 
    : '';
  
  const runtime = details.runtime 
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` 
    : details.episode_run_time && details.episode_run_time.length > 0 
      ? `${Math.floor(details.episode_run_time[0] / 60)}h ${details.episode_run_time[0] % 60}m` 
      : 'N/A';
  
  const rating = details.vote_average ? Math.round(details.vote_average * 10) : 'N/A';
  
  // Create a Media object from the details for the watchlist
  const mediaForWatchlist: Media = {
    id: details.id,
    title: details.title || '',
    name: details.name || '',
    poster_path: details.poster_path,
    backdrop_path: details.backdrop_path,
    release_date: details.release_date || '',
    first_air_date: details.first_air_date || '',
    vote_average: details.vote_average,
    media_type: type as 'movie' | 'tv',
    overview: details.overview,
    genre_ids: details.genres.map(genre => genre.id)
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Backdrop */}
      <div className="relative w-full h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-background z-10"></div>
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt={title}
            className="w-full h-full object-cover object-center animate-blur-in"
          />
        )}
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-72 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Poster */}
          <div className="hidden md:block">
            <div className="rounded-lg overflow-hidden poster-shadow animate-fade-in">
              {posterUrl ? (
                <img 
                  src={posterUrl} 
                  alt={title} 
                  className="w-full object-cover"
                />
              ) : (
                <div className="bg-halo-200 aspect-[2/3] flex items-center justify-center">
                  <span className="text-halo-500">No image available</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Details */}
          <div className="md:col-span-2 text-white md:text-left text-center animate-slide-up">
            <h1 className="text-3xl md:text-5xl font-bold text-shadow-lg mb-2">
              {title}
            </h1>
            
            {details.tagline && (
              <p className="text-lg italic text-white/80 mb-4">{details.tagline}</p>
            )}
            
            {/* Mobile Poster (shows only on mobile) */}
            <div className="md:hidden mx-auto max-w-[250px] mb-6">
              <div className="rounded-lg overflow-hidden poster-shadow">
                {posterUrl ? (
                  <img 
                    src={posterUrl} 
                    alt={title} 
                    className="w-full object-cover"
                  />
                ) : (
                  <div className="bg-halo-200 aspect-[2/3] flex items-center justify-center">
                    <span className="text-halo-500">No image available</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Metadata */}
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-6">
              {year && (
                <div className="flex items-center text-white/80">
                  <Calendar size={16} className="mr-1" />
                  <span>{year}</span>
                </div>
              )}
              
              <div className="flex items-center text-white/80">
                <Clock size={16} className="mr-1" />
                <span>{runtime}</span>
              </div>
              
              <div className="flex items-center text-white/80">
                <Star size={16} className="mr-1 text-yellow-400" />
                <span>{rating}%</span>
              </div>
            </div>
            
            {/* Genres */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
              {details.genres.map(genre => (
                <span 
                  key={genre.id} 
                  className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            
            {/* Overview */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Overview</h3>
              <p className="text-white/80 leading-relaxed">
                {details.overview || 'No overview available.'}
              </p>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Button 
                onClick={handleWatch} 
                size="lg" 
                className="rounded-full bg-white text-black hover:bg-white/90 transition-all px-8"
              >
                <Play size={18} className="mr-2" /> Watch Now
              </Button>
              
              <WatchlistButton 
                media={mediaForWatchlist} 
                variant="button" 
                size={18}
              />
            </div>
          </div>
        </div>
        
        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-16 pb-16">
            <MediaGrid 
              title="You May Also Like" 
              medias={recommendations} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Details;
