import SearchBar from '@/components/SearchBar';
import Link from 'next/link';

export default function GlobalNav({ articles, setFilteredArticles }) {
  return (
    <nav className='w-full bg-gray-800 text-white p-4 flex justify-between items-center shadow-md'>
      <div className='w-1/6'></div>
      {/* 🔍 Suchfeld */}
      <div className='w-1/3'>
        <SearchBar
          articles={articles}
          setFilteredArticles={setFilteredArticles}
        />
      </div>
      {/* 🔗 Links (Platzhalter) */}
      <div className='flex space-x-6 mr-8'>
        <Link href='/' className='hover:text-blue-400'>
          Home
        </Link>
        <Link href='#' className='hover:text-blue-400'>
          Über Uns
        </Link>
        <Link href='#' className='hover:text-blue-400'>
          Kontakt
        </Link>
      </div>
    </nav>
  );
}
