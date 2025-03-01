import SearchBar from '@/components/SearchBar';
import Link from 'next/link';

export default function GlobalNav({ articles, setFilteredArticles }) {
  return (
    <nav className='w-[80vw] text-white p-4 flex items-center mx-auto justify-end h-16'>
      {/* 🔍 Suchfeld */}
      <div className='mr-8 w-72'>
        <SearchBar
          articles={articles}
          setFilteredArticles={setFilteredArticles}
        />
      </div>
      {/* 🔗 Links (Platzhalter) */}
      <div className='flex space-x-6 mr-8 w-72'>
        <Link href='/' className='hover:text-blue-400'>
          Home
        </Link>
        <Link
          href='https://github.com/dcazrael/fi_umschulung_2025'
          className='hover:text-blue-400'
        >
          GitHub
        </Link>
      </div>
    </nav>
  );
}
