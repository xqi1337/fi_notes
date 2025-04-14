import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const [navigation, setNavigation] = useState({});
  const [openCategories, setOpenCategories] = useState({});

  // 🔥 API-Anfrage für die Navigation
  useEffect(() => {
    fetch('/api/navigation')
      .then((res) => res.json())
      .then((data) => {
        setNavigation(data);

        // 🔥 Standardmäßig die fünfte Kategorie öffnen
        const toOpenCategory = Object.keys(data)[4];
        if (toOpenCategory) {
          setOpenCategories({ [toOpenCategory]: true });
        }
      })
      .catch((err) => console.error('Fehler beim Laden der Navigation:', err));
  }, []);

  const router = useRouter();

  // 🔥 Toggle-Funktion für Kategorien
  const toggleCategory = (category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <aside className='py-6 pr-4 sticky top-24 text-sm flex self-start shrink-0 flex-col max-w-52 overflow-y-auto extra-scrollbar overflow-x-hidden grow h-[calc(100vh-64px-3.5em)]'>
      {Object.keys(navigation).length === 0 ? (
        <p className='text-gray-500'>Keine Artikel gefunden.</p>
      ) : (
        Object.keys(navigation).map((category, index) => {
          const isOpen = openCategories[category] || false;

          return (
            <div key={index} className='mb-4'>
              {/* 🔥 Klickbare Kategorie */}
              <button
                onClick={() => toggleCategory(category)}
                className='w-full text-left text-md font-bold text-gray-300 mb-2 hover:text-white cursor-pointer focus:outline-none flex justify-between'
              >
                {category}
                <svg
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  className='h-[18px] min-w-[18px] rounded-sm p-0.5 hover:bg-stone-700/5 dark:hover:bg-gray-100/5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M9 5l7 7-7 7'
                    className={`origin-center transition-transform ${isOpen ? 'rotate-90 transform' : ''
                      }'`}
                  ></path>
                </svg>
              </button>

              {/* 🔽 Ein-/Ausklappbare Liste */}
              <ul
                className={`relative flex flex-col gap-1 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                {(Array.isArray(navigation[category])
                  ? navigation[category]
                  : []
                ).map((article, idx) => {
                  const isActive = router.asPath === article.slug;
                  return (
                    <li key={idx} className='flex flex-col'>
                      <Link
                        href={article.slug}
                        className={`font-bold py-1 px-2 rounded-sm my-1 ${isActive
                            ? 'bg-gray-700 text-white'
                            : 'text-stone-500 hover:text-white hover:bg-gray-700'
                          }`}
                      >
                        {article.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })
      )}
    </aside>
  );
}
