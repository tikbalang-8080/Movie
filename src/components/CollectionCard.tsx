import React, { useEffect, useState } from 'react';
import { Collection } from '@/utils/collections';
import { useNavigate } from 'react-router-dom';
import { getImageUrl, getMediaDetails } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface CollectionCardProps {
  collection: Collection;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  const navigate = useNavigate();
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchFirstMovieBackdrop = async () => {
      if (collection.movieIds.length > 0) {
        try {
          const firstMovie = await getMediaDetails(collection.movieIds[0].toString(), 'movie');
          if (firstMovie.backdrop_path) {
            setBackgroundImageUrl(getImageUrl(firstMovie.backdrop_path, 'original'));
          }
        } catch (error) {
          console.error('Error fetching first movie backdrop:', error);
        }
      }
    };

    fetchFirstMovieBackdrop();
  }, [collection.movieIds]);
  
  const handleClick = () => {
    // Navigate to the collection details page
    navigate(`/collection/${collection.id}`);
  };
  
  return (
    <div 
      className="relative h-40 overflow-hidden rounded-xl group cursor-pointer transition-transform hover:scale-[1.02] duration-300"
      onClick={handleClick}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 z-10"></div>
        {backgroundImageUrl && (
          <img 
            src={backgroundImageUrl}
            alt={collection.name}
            className="w-full h-full object-cover object-center"
          />
        )}
      </div>
      
      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-end p-4">
        <h3 className="text-white text-lg font-bold">{collection.name}</h3>
        <p className="text-white/70 text-sm mt-1 line-clamp-1">{collection.movieIds.length} Movies</p>
        
        {/* Play button (appears on hover) */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="default" size="sm" className="rounded-full bg-white text-black hover:bg-white/90">
            <Play size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
