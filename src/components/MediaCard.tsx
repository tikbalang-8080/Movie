
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Media, getImageUrl } from '@/utils/api';
import { Play } from 'lucide-react';
import WatchlistButton from './WatchlistButton';

interface MediaCardProps {
  media: Media;
  index?: number;
}

const MediaCard: React.FC<MediaCardProps> = ({ media, index = 0 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  
  const posterUrl = getImageUrl(media.poster_path);
  const title = media.title || media.name || 'Unknown Title';
  const releaseDate = media.release_date || media.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const mediaType = media.media_type || (media.first_air_date ? 'tv' : 'movie');
  const rating = media.vote_average ? Math.round(media.vote_average * 10) : null;

  const handleClick = () => {
    navigate(`/details/${mediaType}/${media.id}`);
  };

  const handleWatch = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/watch/${mediaType}/${media.id}`);
  };

  // Delay for staggered animation
  const animationDelay = Math.min(index, 10) * 50;

  return (
    <div 
      className="media-card relative group cursor-pointer opacity-0 animate-fade-in"
      style={{ animationDelay: `${animationDelay}ms`, animationFillMode: 'forwards' }}
      onClick={handleClick}
    >
      <div className="overflow-hidden rounded-lg poster-shadow transition-transform duration-300 transform group-hover:scale-[1.02]">
        <div className="relative aspect-[2/3] bg-halo-800 overflow-hidden">
          {posterUrl ? (
            <>
              <div className={`absolute inset-0 bg-halo-800 ${imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`} />
              <img
                src={posterUrl}
                alt={title}
                className={`w-full h-full object-cover object-center transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-halo-800 text-white/50">
              <span className="text-sm">No Image</span>
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Rating badge */}
          {rating && (
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-semibold py-1 px-2 rounded-full">
              {rating}%
            </div>
          )}
          
          {/* Action buttons */}
          <div className="media-card-info absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
            <WatchlistButton media={media} />
            
            <button 
              onClick={handleWatch}
              className="bg-white text-black hover:bg-white/90 transition-all rounded-full p-2"
              aria-label="Play"
            >
              <Play size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Title */}
      <div className="mt-2 text-left">
        <h3 className="font-medium text-sm text-white line-clamp-1">{title}</h3>
        <p className="text-xs text-white/60">{year}</p>
      </div>
    </div>
  );
};

export default MediaCard;
