
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { getMediaDetails, MediaDetails, getSeasonDetails, Episode } from '@/utils/api';
import { Provider, getDefaultProvider } from '@/utils/providers';
import ProviderSelector from '@/components/ProviderSelector';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Info, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loader from '@/components/Loader';

const Watch: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [media, setMedia] = useState<MediaDetails | null>(null);
  const [provider, setProvider] = useState<Provider>(getDefaultProvider());
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!type || !id) return;
    
    const fetchMediaDetails = async () => {
      setLoading(true);
      try {
        const mediaData = await getMediaDetails(id, type as 'movie' | 'tv');
        setMedia(mediaData);
        
        if (type === 'tv') {
          const seasonData = await getSeasonDetails(id, selectedSeason);
          setEpisodes(seasonData.episodes);
        }
      } catch (error) {
        console.error('Error fetching media details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaDetails();
  }, [type, id, selectedSeason]);

  const handleBackToDetails = () => {
    navigate(`/details/${type}/${id}`);
  };

  const handleSeasonChange = (value: string) => {
    const season = parseInt(value);
    setSelectedSeason(season);
    setSelectedEpisode(1);
  };

  const handleEpisodeChange = (value: string) => {
    setSelectedEpisode(parseInt(value));
  };

  const getWatchUrl = () => {
    if (!media) return '';
    
    if (type === 'movie') {
      return provider.movieUrl.replace('{tmdb_id}', id || '');
    } else {
      return provider.tvUrl
        .replace('{tmdb_id}', id || '')
        .replace('{season_number}', selectedSeason.toString())
        .replace('{episode_number}', selectedEpisode.toString());
    }
  };

  const watchUrl = getWatchUrl();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  if (!media) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold">Media not found</h1>
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

  const title = media.title || media.name || '';
  const totalSeasons = media.number_of_seasons || 0;
  const currentEpisode = episodes.find(ep => ep.episode_number === selectedEpisode);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16 pb-10 w-full">
        {/* Player Container */}
        <div className="w-full bg-black">
          <div className="aspect-video max-w-7xl mx-auto relative">
            <iframe
              src={watchUrl}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
              title={title}
            ></iframe>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          {/* Controls */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handleBackToDetails}
                className="rounded-full"
              >
                <ArrowLeft size={20} />
              </Button>
              
              <h1 className="text-xl font-bold truncate">
                {title}
                {type === 'tv' && currentEpisode && ` - S${selectedSeason}:E${selectedEpisode} - ${currentEpisode.name}`}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="rounded-lg"
              >
                {showDetails ? <ChevronUp size={16} className="mr-1" /> : <ChevronDown size={16} className="mr-1" />}
                {showDetails ? 'Hide Details' : 'Show Details'}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleBackToDetails}
                className="rounded-full"
              >
                <Info size={20} />
              </Button>
            </div>
          </div>
          
          {/* Season and Episode Selectors for TV Shows */}
          {type === 'tv' && (
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="w-full md:w-auto">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Select
                      value={selectedSeason.toString()}
                      onValueChange={handleSeasonChange}
                    >
                      <SelectTrigger className="min-w-[140px]">
                        <SelectValue placeholder="Season" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((season) => (
                          <SelectItem key={season} value={season.toString()}>
                            Season {season}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Select
                      value={selectedEpisode.toString()}
                      onValueChange={handleEpisodeChange}
                    >
                      <SelectTrigger className="min-w-[140px]">
                        <SelectValue placeholder="Episode" />
                      </SelectTrigger>
                      <SelectContent>
                        {episodes.map((episode) => (
                          <SelectItem key={episode.id} value={episode.episode_number.toString()}>
                            Episode {episode.episode_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-auto flex-grow">
                <ProviderSelector
                  selectedProvider={provider}
                  onSelectProvider={setProvider}
                />
              </div>
            </div>
          )}
          
          {/* Provider selection for movies */}
          {type === 'movie' && (
            <div className="mb-6">
              <div className="max-w-xs">
                <ProviderSelector
                  selectedProvider={provider}
                  onSelectProvider={setProvider}
                />
              </div>
            </div>
          )}
          
          {/* Episode details for TV Shows */}
          {type === 'tv' && showDetails && currentEpisode && (
            <div className="mb-8 animate-fade-in">
              <h3 className="text-lg font-medium mb-2">
                S{selectedSeason}:E{selectedEpisode} - {currentEpisode.name}
              </h3>
              <p className="text-halo-600 text-sm mb-2">
                {new Date(currentEpisode.air_date).toLocaleDateString()} • {currentEpisode.runtime} min
              </p>
              <p className="text-halo-800">
                {currentEpisode.overview || 'No overview available for this episode.'}
              </p>
            </div>
          )}
          
          {/* Movie details */}
          {type === 'movie' && showDetails && (
            <div className="mb-8 animate-fade-in">
              <h3 className="text-lg font-medium mb-2">{media.title}</h3>
              <p className="text-halo-600 text-sm mb-2">
                {media.release_date && new Date(media.release_date).toLocaleDateString()} • {media.runtime} min
              </p>
              <p className="text-halo-800">
                {media.overview || 'No overview available.'}
              </p>
            </div>
          )}
          
          {/* Provider warning */}
          {provider.warning && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div>
                  <p className="text-sm text-yellow-700">
                    <span className="font-medium">Note:</span> {provider.warning}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Watch;
