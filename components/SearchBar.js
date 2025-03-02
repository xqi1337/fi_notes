import { highlightMatch } from '@/utils/search';
import {
  handleKeyDown,
  handleSearch,
  handleSearchSelection,
} from '@/utils/searchHandlers';
import { getRecentSearches, saveSearchQuery } from '@/utils/searchHistory';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useSearchWorker } from './hooks/useSearchWorker';

export default function SearchBar({ articles }) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false); // Zeigt `recentSearches` an
  const [hasTyped, setHasTyped] = useState(false); // Schaltet zwischen `recentSearches` & `Ergebniscontainer`

  const router = useRouter();
  const searchRef = useRef(null);
  const { results, setResults } = useSearchWorker(query);

  const resultsRef = useRef(null); // 🔥 Referenz für das Ergebnis-Container
  const itemRefs = useRef([]);
  useEffect(() => {
    if (!itemRefs.current) itemRefs.current = [];
  }, []);

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
    if (selectedIndex >= 0) {
      const element = itemRefs.current[selectedIndex];
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [selectedIndex]);

  return (
    <div
      ref={searchRef}
      className='relative w-full'
      onKeyDown={(e) =>
        handleKeyDown(
          e,
          results,
          selectedIndex,
          setSelectedIndex,
          handleSearchSelection,
          query,
          router,
          setQuery,
          setResults,
          saveSearchQuery,
          getRecentSearches,
          itemRefs // 🔥 Jetzt wird `itemRefs` explizit übergeben!
        )
      }
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
                  handleSearch(
                    search,
                    setQuery,
                    saveSearchQuery,
                    setRecentSearches,
                    getRecentSearches
                  );
                  setResults([]);
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
        <div
          ref={resultsRef}
          className='absolute mt-2 w-md bg-neutral-950 border border-neutral-600 rounded-md shadow-lg z-50 right-0 overflow-y-auto extra-scrollbar max-h-96'
        >
          <ul className='p-1'>
            {(() => {
              let absoluteIndex = 0; // 🔥 Globaler Index-Zähler für alle `li`
              return Object.entries(results).flatMap(([category, items]) => {
                return [
                  <div
                    key={category}
                    className='text-neutral-200 font-bold text-sm uppercase border-b border-neutral-600 p-2'
                  >
                    {category}
                  </div>,
                  ...items.map((result) => {
                    const currentIndex = absoluteIndex++; // 🔥 Erst hier erhöhen und dann nutzen
                    return (
                      <li
                        key={currentIndex}
                        ref={(el) => {
                          if (el && !itemRefs.current[currentIndex]) {
                            itemRefs.current[currentIndex] = el;
                          }
                        }}
                        className={`cursor-pointer hover:bg-neutral-900 p-2 rounded-md mt-2 ${
                          currentIndex === selectedIndex ? 'bg-neutral-900' : ''
                        }`}
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
                    );
                  }),
                ];
              });
            })()}
          </ul>
        </div>
      )}
    </div>
  );
}
