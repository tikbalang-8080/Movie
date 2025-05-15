
import React from 'react';
import { Media } from '@/utils/api';
import MediaCard from './MediaCard';

interface MediaGridProps {
  title: string;
  medias: Media[];
  isLoading?: boolean;
}

const MediaGrid: React.FC<MediaGridProps> = ({ title, medias, isLoading = false }) => {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-halo-800 rounded-lg aspect-[2/3]"></div>
              <div className="mt-2 h-4 bg-halo-800 rounded w-3/4"></div>
              <div className="mt-2 h-3 bg-halo-800 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {medias.length === 0 ? (
            <div className="text-center py-12 text-white/50">
              No results found.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {medias.map((media, index) => (
                <MediaCard key={media.id} media={media} index={index} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MediaGrid;
