import { getRecentSearches, saveSearchQuery } from '@/utils/searchHistory';
import { useEffect, useState } from 'react';

export function useSearchHistory() {
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  const saveAndUpdateHistory = (query) => {
    saveSearchQuery(query);
    setRecentSearches(getRecentSearches());
  };

  return { recentSearches, saveSearchQuery: saveAndUpdateHistory };
}
