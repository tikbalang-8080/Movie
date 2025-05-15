
import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { addToWatchlist, removeFromWatchlist, isInWatchlist, WATCHLIST_UPDATED_EVENT } from '@/utils/watchlist';
import { Media } from '@/utils/api';
import { toast } from '@/components/ui/use-toast';

interface WatchlistButtonProps {
  media: Media;
  variant?: 'icon' | 'button';
  className?: string;
  size?: number;
}

const WatchlistButton: React.FC<WatchlistButtonProps> = ({ 
  media, 
  variant = 'icon',
  className = '',
  size = 20 
}) => {
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  
  useEffect(() => {
    const updateWatchlistState = () => {
      setIsWatchlisted(isInWatchlist(media.id));
    };
    
    updateWatchlistState();
    
    // Listen for watchlist changes
    window.addEventListener(WATCHLIST_UPDATED_EVENT, updateWatchlistState);
    window.addEventListener('storage', updateWatchlistState);
    
    return () => {
      window.removeEventListener(WATCHLIST_UPDATED_EVENT, updateWatchlistState);
      window.removeEventListener('storage', updateWatchlistState);
    };
  }, [media.id]);
  
  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isWatchlisted) {
      removeFromWatchlist(media.id);
      toast({
        title: "Removed from Watchlist",
        description: `"${media.title || media.name}" has been removed from your watchlist.`,
      });
    } else {
      addToWatchlist(media);
      toast({
        title: "Added to Watchlist",
        description: `"${media.title || media.name}" has been added to your watchlist.`,
      });
    }
  };
  
  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggleWatchlist}
        className={`bg-black/40 hover:bg-black/60 transition-all rounded-full p-2 ${className}`}
        aria-label={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
      >
        {isWatchlisted ? (
          <BookmarkCheck size={size} className="text-primary" />
        ) : (
          <Bookmark size={size} className="text-white" />
        )}
      </button>
    );
  }
  
  return (
    <button
      onClick={handleToggleWatchlist}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
        isWatchlisted 
          ? 'bg-primary/10 text-primary hover:bg-primary/20' 
          : 'bg-white/10 text-white hover:bg-white/20'
      } ${className}`}
    >
      {isWatchlisted ? (
        <>
          <BookmarkCheck size={size} />
          <span>In Watchlist</span>
        </>
      ) : (
        <>
          <Bookmark size={size} />
          <span>Add to Watchlist</span>
        </>
      )}
    </button>
  );
};

export default WatchlistButton;
