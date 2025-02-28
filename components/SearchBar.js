import { searchArticles } from '@/utils/search';
import { useState } from 'react';

export default function SearchBar({ articles, setFilteredArticles }) {
  const [query, setQuery] = useState('');

  const handleSearch = (event) => {
    const value = event.target.value;
    setQuery(value);

    const filtered = searchArticles(value, articles);
    setFilteredArticles(filtered);
  };

  return (
    <>
      <input
        type='text'
        placeholder='Suche nach Artikeln oder Inhalten...'
        value={query}
        onChange={handleSearch}
        className='w-full p-2 rounded-md border border-gray-200 text-gray-200'
      />
    </>
  );
}
