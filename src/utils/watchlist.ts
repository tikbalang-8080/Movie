
import { Media } from './api';

// Event for components to listen to watchlist changes
export const WATCHLIST_UPDATED_EVENT = 'watchlist-updated';

// Notify all components that the watchlist has been updated
export const notifyWatchlistUpdated = () => {
  window.dispatchEvent(new Event(WATCHLIST_UPDATED_EVENT));
};

// Get the watchlist from localStorage
export const getWatchlist = (): Media[] => {
  const watchlist = localStorage.getItem('watchlist');
  return watchlist ? JSON.parse(watchlist) : [];
};

// Add a media item to the watchlist
export const addToWatchlist = (media: Media): void => {
  const watchlist = getWatchlist();
  
  // Check if the media is already in the watchlist
  if (!watchlist.some(item => item.id === media.id)) {
    const updatedWatchlist = [...watchlist, media];
    localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
    notifyWatchlistUpdated();
  }
};

// Remove a media item from the watchlist
export const removeFromWatchlist = (mediaId: number): void => {
  const watchlist = getWatchlist();
  const updatedWatchlist = watchlist.filter(item => item.id !== mediaId);
  localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
  notifyWatchlistUpdated();
};

// Check if a media item is in the watchlist
export const isInWatchlist = (mediaId: number): boolean => {
  const watchlist = getWatchlist();
  return watchlist.some(item => item.id === mediaId);
};
