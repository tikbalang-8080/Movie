import { toast } from "@/components/ui/use-toast";

// TMDB API key
const API_KEY = "71fdb081b0133511ac14ac0cc10fd307";
const BASE_URL = "https://api.themoviedb.org/3";

// Types
export interface Media {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: "movie" | "tv";
  genre_ids: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface MediaDetails extends Media {
  genres: Genre[];
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  status: string;
  tagline: string;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
}

export interface SeasonDetails {
  id: number;
  name: string;
  season_number: number;
  episodes: Episode[];
  poster_path: string;
  overview: string;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string;
  episode_number: number;
  season_number: number;
  air_date: string;
  runtime: number;
}

export interface SearchResults {
  page: number;
  results: Media[];
  total_pages: number;
  total_results: number;
}

// Generic fetch function with error handling
const fetchApi = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json() as T;
  } catch (error) {
    console.error("API fetch error:", error);
    toast({
      title: "Error",
      description: "Failed to fetch data. Please try again later.",
      variant: "destructive",
    });
    throw error;
  }
};

// Trending
export const getTrending = (timeWindow: "day" | "week" = "week", page: number = 1) => {
  return fetchApi<SearchResults>(`/trending/all/${timeWindow}?api_key=${API_KEY}&page=${page}`);
};

// Popular Movies
export const getPopularMovies = (page: number = 1) => {
  return fetchApi<SearchResults>(`/movie/popular?api_key=${API_KEY}&page=${page}`);
};

// Popular TV Shows
export const getPopularTVShows = (page: number = 1) => {
  return fetchApi<SearchResults>(`/tv/popular?api_key=${API_KEY}&page=${page}`);
};

// Top Rated Movies
export const getTopRatedMovies = (page: number = 1) => {
  return fetchApi<SearchResults>(`/movie/top_rated?api_key=${API_KEY}&page=${page}`);
};

// Top Rated TV Shows
export const getTopRatedTVShows = (page: number = 1) => {
  return fetchApi<SearchResults>(`/tv/top_rated?api_key=${API_KEY}&page=${page}`);
};

// Now Playing Movies
export const getNowPlayingMovies = (page: number = 1) => {
  return fetchApi<SearchResults>(`/movie/now_playing?api_key=${API_KEY}&page=${page}`);
};

// TV Shows Currently Airing
export const getOnAirTVShows = (page: number = 1) => {
  return fetchApi<SearchResults>(`/tv/on_the_air?api_key=${API_KEY}&page=${page}`);
};

// Get Media Details (Movie or TV Show)
export const getMediaDetails = (id: string, type: "movie" | "tv") => {
  return fetchApi<MediaDetails>(`/${type}/${id}?api_key=${API_KEY}`);
};

// Get Season Details
export const getSeasonDetails = (tvId: string, seasonNumber: number) => {
  return fetchApi<SeasonDetails>(`/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}`);
};

// Search
export const searchMedia = (query: string, page: number = 1) => {
  return fetchApi<SearchResults>(`/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
};

// Get image URL
export const getImageUrl = (path: string | null, size: "original" | "w500" | "w780" = "w500") => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Get movie/TV genres
export const getGenres = async (type: "movie" | "tv") => {
  return fetchApi<{genres: Genre[]}>(`/genre/${type}/list?api_key=${API_KEY}`);
};

// Get recommendations
export const getRecommendations = (id: string, type: "movie" | "tv", page: number = 1) => {
  return fetchApi<SearchResults>(`/${type}/${id}/recommendations?api_key=${API_KEY}&page=${page}`);
};
