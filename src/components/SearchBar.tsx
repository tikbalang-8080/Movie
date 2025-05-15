
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Media, searchMedia, getImageUrl } from '@/utils/api';

interface SearchBarProps {
  onClose?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current && 
        !resultsRef.current.contains(event.target as Node) && 
        event.target !== inputRef.current
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [query]);

  const performSearch = async () => {
    if (query.trim() === '') return;
    
    setIsLoading(true);
    try {
      const data = await searchMedia(query);
      setResults(data.results.slice(0, 5));
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowResults(false);
      if (onClose) onClose();
    }
  };

  const handleResultClick = (media: Media) => {
    const mediaType = media.media_type || (media.first_air_date ? 'tv' : 'movie');
    navigate(`/details/${mediaType}/${media.id}`);
    setShowResults(false);
    if (onClose) onClose();
  };

  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for movies, TV shows..."
            value={query}
            onChange={handleInputChange}
            onClick={() => results.length > 0 && setShowResults(true)}
            className="w-full py-2 pl-10 pr-10 rounded-full bg-secondary border-white/10 text-white placeholder:text-white/50 focus-visible:ring-white/30 focus-visible:ring-offset-background focus-visible:ring-offset-2"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
            <SearchIcon size={18} />
          </div>
          {query && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-secondary/90 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden z-50 animate-scale-in border border-white/10"
        >
          <div className="max-h-80 overflow-y-auto">
            {results.map((media) => {
              const posterUrl = getImageUrl(media.poster_path);
              const title = media.title || media.name || 'Unknown';
              const mediaType = media.media_type || (media.first_air_date ? 'tv' : 'movie');
              
              return (
                <div
                  key={`${mediaType}-${media.id}`}
                  onClick={() => handleResultClick(media)}
                  className="flex items-center p-3 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex-shrink-0 w-12 h-16 bg-background overflow-hidden rounded">
                    {posterUrl ? (
                      <img
                        src={posterUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-white/50">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1 text-left">
                    <p className="font-medium text-white">{title}</p>
                    <p className="text-xs text-white/60 capitalize">{mediaType}</p>
                  </div>
                </div>
              );
            })}
            <div 
              className="bg-white/5 p-2 text-center cursor-pointer hover:bg-white/10"
              onClick={() => {
                navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                setShowResults(false);
                if (onClose) onClose();
              }}
            >
              <p className="text-sm font-medium text-white/80">View all results</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
