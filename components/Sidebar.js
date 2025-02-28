import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const [navigation, setNavigation] = useState({});

  // 🔥 API-Anfrage für die Navigation
  useEffect(() => {
    fetch('/api/navigation')
      .then((res) => res.json())
      .then((data) => {
        setNavigation(data);
      })
      .catch((err) => console.error('Fehler beim Laden der Navigation:', err));
  }, []);
  const router = useRouter();
  return (
    <aside className='p-6 border-r border-gray-700 sticky top-25 text-sm flex self-start shrink-0 flex-col'>
      {Object.keys(navigation).length === 0 ? (
        <p className='text-gray-500'>Keine Artikel gefunden.</p>
      ) : (
        Object.keys(navigation).map((category, index) => (
          <div key={index} className='mb-4 overflow-y-auto'>
            {/* 🔥 Kategorie-Überschrift */}
            <h3 className='text-md font-bold text-gray-300 mb-2'>{category}</h3>
            <ul>
              {(Array.isArray(navigation[category])
                ? navigation[category]
                : []
              ).map((article, idx) => {
                const isActive = router.asPath === article.slug;
                return (
                  <li key={idx} className='flex flex-col'>
                    <Link
                      href={article.slug}
                      className={`text-gray-400 font-bold py-1 px-2 rounded-sm my-1 ${
                        isActive
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      {article.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      )}
    </aside>
  );
}
