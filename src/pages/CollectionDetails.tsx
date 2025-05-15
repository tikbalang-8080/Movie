
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMediaDetails, Media, getImageUrl } from '@/utils/api';
import { popularCollections, streamingCollections } from '@/utils/collections';
import Navbar from '@/components/Navbar';
import MediaGrid from '@/components/MediaGrid';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

const CollectionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [collectionTitle, setCollectionTitle] = useState('');
  const [backdropPath, setBackdropPath] = useState('');
  const [description, setDescription] = useState('');
  const [movieIds, setMovieIds] = useState<number[]>([]);
  
  // Find the collection (either from popular or streaming collections)
  useEffect(() => {
    if (!id) return;
    
    // Check in popular collections first
    const popularCollection = popularCollections.find(c => c.id.toString() === id);
    if (popularCollection) {
      setCollectionTitle(popularCollection.name);
      setBackdropPath(popularCollection.backdropPath);
      setDescription(popularCollection.description);
      setMovieIds(popularCollection.movieIds);
      return;
    }
    
    // Then check in streaming collections
    const streamingCollection = streamingCollections.find(c => c.id === id);
    if (streamingCollection) {
      setCollectionTitle(streamingCollection.name);
      setMovieIds(streamingCollection.movieIds);
    }
  }, [id]);
  
  // Fetch all movies in the collection
  const { data: collectionMovies, isLoading } = useQuery({
    queryKey: ['collection-movies', id],
    queryFn: async () => {
      if (!movieIds.length) return [];
      
      const moviePromises = movieIds.map(movieId => 
        getMediaDetails(movieId.toString(), 'movie')
      );
      
      try {
        const movies = await Promise.all(moviePromises);
        return movies.map(movie => ({
          ...movie,
          media_type: 'movie'
        } as Media));
      } catch (error) {
        console.error('Error fetching collection movies:', error);
        return [];
      }
    },
    enabled: movieIds.length > 0
  });
  
  // Use the first movie's backdrop if the collection doesn't have one
  const fallbackBackdrop = collectionMovies && collectionMovies.length > 0 
    ? collectionMovies[0].backdrop_path 
    : null;
    
  const backgroundImage = getImageUrl(backdropPath || fallbackBackdrop, 'original');
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero banner with collection info */}
      <div className="relative">
        {backgroundImage && (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/60 to-background z-10"></div>
            <img 
              src={backgroundImage} 
              alt={collectionTitle}
              className="w-full h-[40vh] object-cover object-center"
            />
          </>
        )}
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
          <Button 
            variant="ghost" 
            className="text-white mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2" size={16} />
            Back
          </Button>
          
          <h1 className="text-4xl font-bold text-white mb-4 text-center">{collectionTitle}</h1>
          {description && (
            <p className="text-white/70 max-w-2xl mx-auto text-center mb-6">{description}</p>
          )}
          <p className="text-white/90 text-center">{movieIds.length} Movies</p>
        </div>
      </div>
      
      {/* Movies grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MediaGrid 
          title="Movies in this collection"
          medias={collectionMovies || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default CollectionDetails;
