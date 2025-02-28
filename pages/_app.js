import GlobalNav from '@/components/GlobalNav';
import Sidebar from '@/components/Sidebar';
import Topics from '@/components/Topics';
import '@/styles/globals.css';
import { useState } from 'react';

export default function MyApp({ Component, pageProps }) {
  const [filteredArticles, setFilteredArticles] = useState(
    pageProps.articles || []
  );

  return (
    <>
      {/* 🌎 Globale Navigation */}
      <div className='flex sticky top-0 bg-transparent'>
        <GlobalNav
          articles={pageProps.articles || []}
          setFilteredArticles={setFilteredArticles}
        />
      </div>
      <div className='flex flex-col min-h-screen text-gray-300 w-7xl mx-auto relative'>
        <div className='flex flex-grow'>
          {/* Sidebar bleibt immer sichtbar */}
          <Sidebar />
          {/* Hauptinhalt */}
          <Component {...pageProps} />
          {/* 🔥 Inhaltsverzeichnis statt RelatedArticles */}
          <Topics headings={pageProps.headings || []} />
        </div>
      </div>
    </>
  );
}
