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
    <aside className='py-6 sticky top-24 text-sm flex self-start shrink-0 flex-col max-w-54'>
      {Object.keys(navigation).length === 0 ? (
        <p className='text-gray-500'>Keine Artikel gefunden.</p>
      ) : (
        Object.keys(navigation).map((category, index) => (
          <div key={index} className='mb-4 overflow-y-auto'>
            {/* 🔥 Kategorie-Überschrift */}
            <h3 className='text-md font-bold text-gray-300 mb-2'>{category}</h3>
            <ul className='relative flex flex-col gap-1 before:absolute before:inset-y-1 before:w-px before:bg-gray-200 before:content-[""] ltr:ml-3 ltr:pl-3 ltr:before:left-0 rtl:mr-3 rtl:pr-3 rtl:before:right-0 dark:before:bg-neutral-800'>
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
