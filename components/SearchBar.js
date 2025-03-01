import { createSearchIndex, searchArticles } from '@/utils/search';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function SearchBar({ articles }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [fuse, setFuse] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1); // 🔥 Speichert das aktive Ergebnis
  const resultsRef = useRef(null); // 🔥 Referenz für die Ergebnisliste

  useEffect(() => {
    fetch('/search-index.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Fehler beim Laden des Suchindex.');
        }
        return res.json();
      })
      .then((data) => setFuse(createSearchIndex(data)))
      .catch((err) =>
        console.error('Suchindex konnte nicht geladen werden:', err)
      );
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim() && fuse) {
        setResults(searchArticles(query, fuse));
        setSelectedIndex(-1); // Reset beim neuen Suchbegriff
      } else {
        setResults([]);
      }
    }, 200); // 🔥 Debouncing: 200ms Verzögerung

    return () => clearTimeout(handler);
  }, [query, fuse]);

  useEffect(() => {
    async function fetchSearchIndex() {
      try {
        // 🔥 Prüfe, ob ein gespeicherter Index existiert
        const cachedIndex = localStorage.getItem('searchIndex');
        const cachedTimestamp = localStorage.getItem('searchIndexTimestamp');

        // 🔥 Hole das letzte Änderungsdatum des Index vom Server
        const res = await fetch('/api/search-index');
        if (!res.ok) throw new Error('Fehler beim Laden des Suchindex.');
        const serverIndex = await res.json();
        const serverTimestamp = new Date(
          res.headers.get('Last-Modified')
        ).getTime();

        // 🔥 Falls keine Änderungen → Lade gespeicherten Index
        if (
          cachedIndex &&
          cachedTimestamp &&
          serverTimestamp <= cachedTimestamp
        ) {
          setFuse(createSearchIndex(JSON.parse(cachedIndex)));
          return;
        }

        // 🔥 Falls Index neu → Speichere ihn in localStorage
        localStorage.setItem('searchIndex', JSON.stringify(serverIndex));
        localStorage.setItem(
          'searchIndexTimestamp',
          serverTimestamp.toString()
        );
        setFuse(createSearchIndex(serverIndex));
      } catch (err) {
        console.error('Suchindex konnte nicht geladen werden:', err);
      }
    }

    fetchSearchIndex();
  }, []);

  // 🔥 Keyboard-Navigation
  const handleKeyDown = (e) => {
    if (!results.length) return;

    if (e.key === 'ArrowDown') {
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0) {
        window.location.href = results[selectedIndex].slug; // 🔥 Direkt zum Ergebnis springen
      }
    } else if (e.key === 'Escape') {
      setQuery('');
      setResults([]);
    }
  };

  return (
    <div className='relative w-full' onKeyDown={handleKeyDown} tabIndex={0}>
      {/* 🔍 Suchfeld */}
      <input
        type='text'
        placeholder='Suche nach Artikeln oder Überschriften...'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className='w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
      />

      {/* 📌 Ergebnisse anzeigen */}
      {query && results.length > 0 && (
        <div
          className='absolute mt-2 w-full bg-gray-900 border border-gray-600 rounded-md shadow-lg z-50'
          ref={resultsRef}
        >
          <ul className='divide-y divide-gray-700'>
            {results.map((result, idx) => (
              <li
                key={result.slug}
                className={`p-2 hover:bg-gray-700 cursor-pointer ${
                  idx === selectedIndex ? 'bg-gray-700' : ''
                }`}
                onMouseEnter={() => setSelectedIndex(idx)}
                onClick={() => (window.location.href = result.slug)}
              >
                <Link href={result.slug}>
                  <span
                    className='text-blue-400 font-bold'
                    dangerouslySetInnerHTML={{
                      __html: result.highlightedTitle,
                    }}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ❌ Keine Ergebnisse */}
      {query && results.length === 0 && (
        <div className='absolute mt-2 w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-gray-400'>
          Keine Ergebnisse gefunden.
        </div>
      )}
    </div>
  );
}
