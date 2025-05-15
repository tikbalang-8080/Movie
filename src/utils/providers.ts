
export interface Provider {
  id: string;
  name: string;
  movieUrl: string;
  tvUrl: string;
  warning?: string;
  script?: string;
  isHLSPlayer?: boolean;
}

// Add function to manage favorite provider
export const getFavoriteProviderId = (): string => {
  return localStorage.getItem('favoriteProvider') || 'vidsrc';
};

export const setFavoriteProvider = (providerId: string): void => {
  localStorage.setItem('favoriteProvider', providerId);
};

export const getDefaultProvider = (): Provider => {
  const favoriteId = getFavoriteProviderId();
  return providers.find(p => p.id === favoriteId) || providers[0];
};

export const providers: Provider[] = [
  {
    id: 'vidsrc',
    name: 'Vidsrc.su ⭐',
    movieUrl: 'https://vidsrc.su/embed/movie/{tmdb_id}',
    tvUrl: 'https://vidsrc.su/embed/tv/{tmdb_id}/{season_number}/{episode_number}',
    warning: 'You can change provider servers top right'
  },
  {
    id: 'vidfast', 
    name: 'Vidfast',
    movieUrl: 'https://vidfast.pro/movie/{tmdb_id}',
    tvUrl: 'https://vidfast.pro/tv/{tmdb_id}/{season_number}/{episode_number}',
    warning: 'Use Adblocker'
  },
  {
    id: 'videasy',
    name: 'Videasy',
    movieUrl: 'https://player.videasy.net/movie/{tmdb_id}',
    tvUrl: 'https://player.videasy.net/tv/{tmdb_id}/{season_number}/{episode_number}',
    warning: 'Use Adblocker'
  },
  {
    id: 'embedsu',
    name: 'Embed.su',
    movieUrl: 'https://embed.su/embed/movie/{tmdb_id}',
    tvUrl: 'https://embed.su/embed/tv/{tmdb_id}/{season_number}/{episode_number}',
    warning: 'Use Adblocker'
  },
  {
    id: 'vidsrcvip',
    name: 'VidSrc.vip',
    movieUrl: 'https://vidsrc.vip/embed/movie/{tmdb_id}',
    tvUrl: 'https://vidsrc.vip/embed/tv/{tmdb_id}/{season_number}/{episode_number}',
    warning: 'Use Adblocker'
  },
  {
    id: 'autoembed',
    name: 'AutoEmbed',
    movieUrl: 'https://player.autoembed.cc/embed/movie/{tmdb_id}',
    tvUrl: 'https://player.autoembed.cc/embed/tv/{tmdb_id}/{season_number}/{episode_number}',
    warning: 'Use Adblocker'
  },
  {
    id: '2embed',
    name: '2Embed',
    movieUrl: 'https://www.2embed.cc/embed/{tmdb_id}',
    tvUrl: 'https://www.2embed.cc/embedtv/{tmdb_id}&s={season_number}&e={episode_number}',
    warning: 'Use Adblocker'
  }
];
