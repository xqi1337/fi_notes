import { highlightMatch } from '@/utils/search';
import Link from 'next/link';

export default function SearchResults({ hasTyped, results, query }) {
  if (!hasTyped || Object.keys(results).length === 0) return null;

  return (
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
                  <Link
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
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
