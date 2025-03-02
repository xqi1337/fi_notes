import { useEffect, useState } from 'react';

export function useSearchWorker(query) {
  const [worker, setWorker] = useState(null);
  const [workerReady, setWorkerReady] = useState(false);
  const [results, setResults] = useState([]);

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

  useEffect(() => {
    if (!worker || !query.trim() || !workerReady) return;
    worker.postMessage({ action: 'search', query });
  }, [query, worker, workerReady]);

  return { worker, workerReady, results, setResults };
}
