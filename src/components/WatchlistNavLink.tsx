
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { getWatchlist, WATCHLIST_UPDATED_EVENT } from '@/utils/watchlist';

const WatchlistNavLink: React.FC = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const updateCount = () => {
      const watchlist = getWatchlist();
      setCount(watchlist.length);
    };
    
    // Initial count
    updateCount();
    
    // Update on changes
    window.addEventListener('storage', updateCount);
    window.addEventListener(WATCHLIST_UPDATED_EVENT, updateCount);
    
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener(WATCHLIST_UPDATED_EVENT, updateCount);
    };
  }, []);
  
  return (
    <Link
      to="/watchlist"
      className="relative rounded-full p-2 hover:bg-white/10 transition-colors"
    >
      <Bookmark className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
};

export default WatchlistNavLink;
