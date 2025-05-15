import React, { useEffect, useState } from 'react';
import { getTrending, getImageUrl, Media } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Play, Info, Star } from 'lucide-react';

const Hero: React.FC = () => {
  const [featuredMedia, setFeaturedMedia] = useState<Media | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getTrending('day');
        // Filter for items with backdrop images
        const withBackdrops = data.results.filter(
          (item) => item.backdrop_path && (item.title || item.name)
        );
        // Select a random item from the top 10
        const randomIndex = Math.floor(Math.random() * Math.min(10, withBackdrops.length));
        setFeaturedMedia(withBackdrops[randomIndex]);
      } catch (error) {
        console.error('Error fetching trending media:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
    
    // Refresh the hero every 5 minutes
    const intervalId = setInterval(fetchTrending, 300000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (loading || !featuredMedia) {
    return (
      <div className="w-full h-[80vh] bg-halo-900 animate-pulse flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const backdropUrl = getImageUrl(featuredMedia.backdrop_path, 'original');
  const title = featuredMedia.title || featuredMedia.name || '';
  const mediaType = featuredMedia.media_type || (featuredMedia.first_air_date ? 'tv' : 'movie');
  const releaseYear = featuredMedia.release_date 
    ? new Date(featuredMedia.release_date).getFullYear() 
    : featuredMedia.first_air_date 
    ? new Date(featuredMedia.first_air_date).getFullYear()
    : null;
  
  const handleWatch = () => {
    navigate(`/watch/${mediaType}/${featuredMedia.id}`);
  };

  const handleDetails = () => {
    navigate(`/details/${mediaType}/${featuredMedia.id}`);
  };

  return (
    <div className="relative w-full h-[85vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10"></div>
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt={title}
            className="w-full h-full object-cover object-center animate-blur-in"
          />
        )}
      </div>
      
      {/* Content */}
      <div className="container relative z-20 flex flex-col justify-end h-full text-white pb-20">
        {/* Modified container to align all content left */}
        <div className="space-y-4 animate-slide-up max-w-2xl">
          {/* Removed all horizontal centering classes */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-shadow-lg text-left">
            {title}
          </h1>
          
          <div className="flex items-center flex-wrap gap-2 text-white/80">
            {releaseYear && <span className="text-lg">{releaseYear}</span>}
            
            {featuredMedia.vote_average > 0 && (
              <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span>{Math.round(featuredMedia.vote_average * 10) / 10}</span>
              </div>
            )}
            
            <span className="capitalize px-2 py-1 text-xs font-semibold rounded bg-white/20">
              {mediaType}
            </span>
          </div>
          
          <p className="text-lg text-white/90 line-clamp-3">
            {featuredMedia.overview}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Button 
              onClick={handleWatch} 
              size="lg" 
              className="rounded-full bg-white text-black hover:bg-white/90 transition-all"
            >
              <Play size={18} className="mr-2" /> Watch Now
            </Button>
            
            <Button 
              onClick={handleDetails} 
              variant="outline" 
              size="lg"
              className="rounded-full border-white/30 bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all"
            >
              <Info size={18} className="mr-2" /> Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;