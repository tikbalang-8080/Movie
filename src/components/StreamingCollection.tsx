
import React from 'react';
import type { StreamingCollection as StreamingCollectionType } from '@/utils/collections';
import { useNavigate } from 'react-router-dom';
import { getMediaDetails, getImageUrl } from '@/utils/api';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';

interface StreamingCollectionProps {
  collection: StreamingCollectionType;
}

const StreamingCollection: React.FC<StreamingCollectionProps> = ({ collection }) => {
  const navigate = useNavigate();
  
  const { data: movies, isLoading } = useQuery({
    queryKey: ['streaming-collection', collection.id],
    queryFn: async () => {
      const moviePromises = collection.movieIds.slice(0, 8).map(id => 
        getMediaDetails(id.toString(), 'movie')
      );
      return Promise.all(moviePromises);
    }
  });
  
  if (isLoading) {
    return (
      <div className="py-6">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-video rounded-lg" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`h-6 w-1 ${collection.color} rounded-full`}></div>
        <h2 className="text-2xl font-bold text-white">{collection.name}</h2>
        <img src={collection.logo} alt={collection.name} className="h-6 object-contain ml-2" />
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {movies && movies.map((movie) => (
            <CarouselItem key={movie.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
              <div 
                className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => navigate(`/details/movie/${movie.id}`)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                <img 
                  src={getImageUrl(movie.backdrop_path, 'w780')} 
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 p-3 z-20">
                  <h3 className="text-white font-medium text-sm line-clamp-1">{movie.title}</h3>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-black/50 text-white border-none hover:bg-black/70" />
        <CarouselNext className="right-2 bg-black/50 text-white border-none hover:bg-black/70" />
      </Carousel>
    </div>
  );
};

export default StreamingCollection;
