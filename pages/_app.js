import GlobalNav from '@/components/GlobalNav';
import Sidebar from '@/components/Sidebar';
import TableOfContents from '@/components/TableOfContents';
import '@/styles/globals.css';
import 'katex/dist/katex.min.css';

import { useState } from 'react';

export default function MyApp({ Component, pageProps }) {
  const [filteredArticles, setFilteredArticles] = useState(
    pageProps.articles || []
  );

  return (
    <>
      {/* 🌎 Globale Navigation */}

      <div className='fixed top-0 left-0 w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-700 shadow-md'>
        <GlobalNav
          articles={pageProps.articles || []}
          setFilteredArticles={setFilteredArticles}
        />
      </div>
      <div className='flex grow-0 text-neutral-300 w-7xl mx-auto mt-16 relative pt-8'>
        {/* Sidebar bleibt immer sichtbar */}
        <Sidebar />
        {/* Hauptinhalt */}
        <Component {...pageProps} />
        {/* 🔥 Inhaltsverzeichnis statt RelatedArticles */}
        <TableOfContents headings={pageProps.headings || []} />
      </div>
    </>
  );
}
