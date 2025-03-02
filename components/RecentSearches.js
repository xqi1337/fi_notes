export default function RecentSearches({
  isFocused,
  hasTyped,
  recentSearches,
  setQuery,
  setHasTyped,
  saveSearchQuery,
}) {
  if (!isFocused || hasTyped || recentSearches.length === 0) return null;

  return (
    <div className='absolute mt-2 w-full bg-neutral-900 border border-neutral-600 rounded-md shadow-lg z-50 p-2'>
      <p className='text-neutral-400 text-sm mb-2'>Letzte Suchanfragen:</p>
      <ul className='text-blue-400'>
        {recentSearches.map((search, idx) => (
          <li
            key={idx}
            className='cursor-pointer hover:underline p-1'
            onClick={() => {
              setQuery(search);
              setHasTyped(true);
              saveSearchQuery(search); // 🔥 Sicherstellen, dass `saveSearchQuery` korrekt verwendet wird
            }}
          >
            {search}
          </li>
        ))}
      </ul>
    </div>
  );
}
