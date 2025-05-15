
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { searchMedia, Media } from '@/utils/api';
import Navbar from '@/components/Navbar';
import MediaGrid from '@/components/MediaGrid';
import Loader from '@/components/Loader';

const Search: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  const [results, setResults] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      searchMedia(query)
        .then(data => {
          setResults(data.results);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error searching:', error);
          setLoading(false);
        });
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold animate-fade-in">Search Results</h1>
          <p className="text-halo-500 mt-2 animate-fade-in animate-delay-100">
            {query ? `Results for "${query}"` : 'Enter a search term'}
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader size="large" />
          </div>
        ) : (
          <MediaGrid
            title={`Found ${results.length} results`}
            medias={results}
          />
        )}
      </div>
    </div>
  );
};

export default Search;
