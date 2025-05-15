
import React, { useEffect, useState } from 'react';
import { getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getOnAirTVShows, Media } from '@/utils/api';
import Navbar from '@/components/Navbar';
import MediaGrid from '@/components/MediaGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from 'react-router-dom';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const Movies: React.FC = () => {
  const [popularMovies, setPopularMovies] = useState<Media[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Media[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Media[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab') || 'popular';
  const pageFromUrl = parseInt(queryParams.get('page') || '1', 10);
  
  useEffect(() => {
    if (pageFromUrl !== page) {
      setPage(pageFromUrl);
    }
  }, [pageFromUrl]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let apiCall;
        switch (tabFromUrl) {
          case 'top-rated':
            apiCall = getTopRatedMovies(page);
            break;
          case 'now-playing':
            apiCall = getNowPlayingMovies(page);
            break;
          case 'upcoming':
            apiCall = getOnAirTVShows(page); // Reusing on-air function as upcoming for demo
            break;
          default:
            apiCall = getPopularMovies(page);
        }
        
        const data = await apiCall;
        
        switch (tabFromUrl) {
          case 'top-rated':
            setTopRatedMovies(data.results);
            break;
          case 'now-playing':
            setNowPlayingMovies(data.results);
            break;
          case 'upcoming':
            setUpcomingMovies(data.results);
            break;
          default:
            setPopularMovies(data.results);
        }
        
        setTotalPages(Math.min(data.total_pages, 20)); // Limit to 20 pages max
      } catch (error) {
        console.error('Error fetching movie data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tabFromUrl, page]);

  const handleTabChange = (value: string) => {
    navigate(`/movies?tab=${value}`);
  };

  const handlePageChange = (newPage: number) => {
    navigate(`/movies?tab=${tabFromUrl}&page=${newPage}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold animate-fade-in">Movies</h1>
          <p className="text-halo-500 mt-2 animate-fade-in animate-delay-100">
            Discover and watch your favorite movies
          </p>
        </div>
        
        <Tabs 
          defaultValue="popular" 
          value={tabFromUrl}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full md:w-auto grid-cols-4 mb-8">
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
            <TabsTrigger value="now-playing">Now Playing</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
          
          <TabsContent value="popular">
            <MediaGrid
              title="Popular Movies"
              medias={popularMovies}
              isLoading={loading && tabFromUrl === "popular"}
            />
          </TabsContent>
          
          <TabsContent value="top-rated">
            <MediaGrid
              title="Top Rated Movies"
              medias={topRatedMovies}
              isLoading={loading && tabFromUrl === "top-rated"}
            />
          </TabsContent>
          
          <TabsContent value="now-playing">
            <MediaGrid
              title="Now Playing Movies"
              medias={nowPlayingMovies}
              isLoading={loading && tabFromUrl === "now-playing"}
            />
          </TabsContent>
          
          <TabsContent value="upcoming">
            <MediaGrid
              title="Upcoming Movies"
              medias={upcomingMovies}
              isLoading={loading && tabFromUrl === "upcoming"}
            />
          </TabsContent>
        </Tabs>
        
        {/* Pagination */}
        <Pagination className="mt-8">
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
              </PaginationItem>
            )}
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = page <= 3 
                ? i + 1 
                : page >= totalPages - 2 
                  ? totalPages - 4 + i 
                  : page - 2 + i;
              
              if (pageNumber <= totalPages) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink 
                      isActive={pageNumber === page} 
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              return null;
            })}
            
            {page < totalPages && (
              <PaginationItem>
                <PaginationNext onClick={() => handlePageChange(page + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Movies;
