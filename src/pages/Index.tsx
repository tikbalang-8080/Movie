
import React, { useEffect, useState } from 'react';
import { getTrending, getPopularMovies, getPopularTVShows, getNowPlayingMovies, getTopRatedMovies, Media } from '@/utils/api';
import MediaGrid from '@/components/MediaGrid';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Collections from '@/components/Collections';
import StreamingCollection from '@/components/StreamingCollection';
import { streamingCollections } from '@/utils/collections';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Index: React.FC = () => {
  const [trendingMedia, setTrendingMedia] = useState<Media[]>([]);
  const [popularMovies, setPopularMovies] = useState<Media[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<Media[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Media[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true);
      try {
        const [trendingData, moviesData, tvData, nowPlayingData, topRatedData] = await Promise.all([
          getTrending(),
          getPopularMovies(),
          getPopularTVShows(),
          getNowPlayingMovies(),
          getTopRatedMovies()
        ]);

        setTrendingMedia(trendingData.results.slice(0, 12));
        setPopularMovies(moviesData.results.slice(0, 12));
        setPopularTVShows(tvData.results.slice(0, 12));
        setNowPlayingMovies(nowPlayingData.results.slice(0, 12));
        setTopRatedMovies(topRatedData.results.slice(0, 12));
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const SectionHeader = ({ title, link }: { title: string; link: string }) => (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <Link to={link} className="text-halo-500 hover:text-white transition-colors flex items-center gap-1 text-sm">
        View all <ChevronRight size={16} />
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <Collections />
        
        {streamingCollections.map(collection => (
          <StreamingCollection 
            key={collection.id} 
            collection={collection} 
          />
        ))}
        
        <div className="py-6">
          <SectionHeader title="Trending Today" link="/trending" />
          <MediaGrid
            title=""
            medias={trendingMedia}
            isLoading={isLoading}
          />
        </div>
        
        <div className="py-6">
          <SectionHeader title="Popular Movies" link="/movies" />
          <MediaGrid
            title=""
            medias={popularMovies}
            isLoading={isLoading}
          />
        </div>
        
        <div className="py-6">
          <SectionHeader title="Now Playing in Theaters" link="/movies?tab=now-playing" />
          <MediaGrid
            title=""
            medias={nowPlayingMovies}
            isLoading={isLoading}
          />
        </div>
        
        <div className="py-6">
          <SectionHeader title="Top Rated Movies" link="/movies?tab=top-rated" />
          <MediaGrid
            title=""
            medias={topRatedMovies}
            isLoading={isLoading}
          />
        </div>
        
        <div className="py-6">
          <SectionHeader title="Popular TV Shows" link="/tv-shows" />
          <MediaGrid
            title=""
            medias={popularTVShows}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
