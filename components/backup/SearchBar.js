import { highlightMatch } from '@/utils/search';
import { getRecentSearches, saveSearchQuery } from '@/utils/searchHistory';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export default function SearchBar({ articles }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [worker, setWorker] = useState(null);
  const [workerReady, setWorkerReady] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false); // Zeigt `recentSearches` an
  const [hasTyped, setHasTyped] = useState(false); // Schaltet zwischen `recentSearches` & `Ergebniscontainer`

  const router = useRouter();
  const searchRef = useRef(null);

  const handleSearch = (query) => {
    setQuery(query);
    saveSearchQuery(query);
    setRecentSearches(getRecentSearches()); // 🔥 Suchhistorie sofort aktualisieren
  };

  const handleKeyDown = (e) => {
    if (!results.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      handleSearchSelection(query, results[selectedIndex].item.slug); // 🔥 Fix: Speichert die Suche & navigiert
    } else if (e.key === 'Escape') {
      setQuery('');
      setResults([]);
    }
  };

  const handleSearchSelection = (query, slug) => {
    saveSearchQuery(query);
    setRecentSearches(getRecentSearches()); // 🔥 Historie aktualisieren
    router.push(slug); // 🔥 Statt `window.location.href`
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
        setHasTyped(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchWorker = new Worker(
        new URL('../../public/workers/search.worker.js', import.meta.url)
      );
      setWorker(searchWorker);

      searchWorker.onmessage = (e) => {
        if (e.data.action === 'ready') {
          setWorkerReady(true);
        }
        if (e.data.action === 'results') {
          setResults(() => ({ ...e.data.results }));
        }
      };

      fetch('/search-index.json')
        .then((res) => res.json())
        .then((data) =>
          searchWorker.postMessage({ action: 'loadIndex', articles: data })
        );

      return () => searchWorker.terminate();
    }
  }, []);

  // 🔥 Suche starten
  useEffect(() => {
    if (!worker || !query.trim() || !workerReady) return;

    worker.postMessage({ action: 'search', query });
  }, [query, worker, workerReady]); // 🔥 `worker` hinzugefügt

  return (
    <div
      ref={searchRef}
      className='relative w-full'
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* 🔍 Suchfeld */}
      <input
        type='text'
        placeholder='Suche nach Artikeln oder Überschriften...'
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setHasTyped(true); // 🔥 Schaltet von `recentSearches` zu `Ergebniscontainer`
        }}
        onFocus={() => setIsFocused(true)}
        className='w-full p-2 rounded-md border border-neutral-600 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
      />

      {/* 📌 Letzte Suchanfragen (werden nur gezeigt, wenn `isFocused === true` und `!hasTyped`) */}
      {isFocused && !hasTyped && recentSearches.length > 0 && (
        <div className='absolute mt-2 w-full bg-neutral-900 border border-neutral-600 rounded-md shadow-lg z-50 p-2'>
          <p className='text-neutral-400 text-sm mb-2'>Letzte Suchanfragen:</p>
          <ul className='text-blue-400'>
            {recentSearches.map((search, idx) => (
              <li
                key={idx}
                className='cursor-pointer hover:underline p-1'
                onClick={(e) => {
                  setQuery(e.target.value);
                  setHasTyped(true); // 🔥 Schaltet von `recentSearches` zu `Ergebniscontainer`
                  handleSearch(search);
                }}
              >
                {search}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 📌 Suchergebnisse (werden nur gezeigt, wenn `hasTyped === true`) */}
      {hasTyped && Object.keys(results).length > 0 && (
        <div className='absolute mt-2 w-md bg-neutral-950 border border-neutral-600 rounded-md shadow-lg z-50 right-0 overflow-y-auto extra-scrollbar max-h-96'>
          <ul className='p-1'>
            {Object.keys(results).map((articleTitle, idx) => (
              <li key={idx} className='p-2 mb-4 last-of-type:mb-0'>
                <p className='text-neutral-200 font-bold text-sm uppercase border-b border-neutral-600'>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: highlightMatch(articleTitle, query),
                    }}
                  />
                </p>
                <ul className='mt-1'>
                  {results[articleTitle].map((result, index) => (
                    <li
                      key={index}
                      className='cursor-pointer hover:bg-neutral-900 p-2 rounded-md mt-2'
                    >
                      <a
                        href={result.item.slug}
                        className='text-neutral-400 font-bold'
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(result.item.title, query),
                          }}
                        />
                        <p className='text-neutral-400 text-xs mt-1'>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlightMatch(result.match, query),
                            }}
                          />
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
