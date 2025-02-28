import SearchBar from '@/components/SearchBar';
import Link from 'next/link';

export default function GlobalNav({ articles, setFilteredArticles }) {
  return (
    <nav className='w-full text-white p-4 flex items-center shadow-md sticky top-0'>
      {/* 🔍 Suchfeld */}
      <div className='w-full mr-8'>
        <SearchBar
          articles={articles}
          setFilteredArticles={setFilteredArticles}
        />
      </div>
      {/* 🔗 Links (Platzhalter) */}
      <div className='flex space-x-6 mr-8 w-64'>
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
