import GlobalNav from '@/components/GlobalNav';
import RelatedArticles from '@/components/RelatedArticles';
import Sidebar from '@/components/Sidebar';
import '@/styles/globals.css';
import { useState } from 'react';

export default function MyApp({ Component, pageProps }) {
  const [filteredArticles, setFilteredArticles] = useState(
    pageProps.articles || []
  );

  return (
    <div className='flex flex-col min-h-screen bg-gray-900 text-gray-200'>
      {/* 🌎 Globale Navigation mit Suche */}
      <GlobalNav
        articles={pageProps.articles || []}
        setFilteredArticles={setFilteredArticles}
      />

      <div className='flex flex-grow'>
        {/* Sidebar bleibt immer sichtbar */}
        <Sidebar articles={filteredArticles} />

        {/* Hauptinhalt */}
        <main className='w-4/6 p-6'>
          <Component {...pageProps} />
        </main>

        {/* Rechte Sidebar */}
        <RelatedArticles />
      </div>
    </div>
  );
}
