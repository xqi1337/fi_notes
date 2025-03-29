import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-50px 0px -70% 0px', threshold: 0.1 }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect(); // Cleanup Observer
  }, [headings]);

  // 🔥 Gruppen für verschachtelte Überschriften (h3 unter h2)
  const groupedHeadings = [];
  let lastH2 = null;

  headings.forEach((heading) => {
    if (heading.level === 2) {
      lastH2 = { ...heading, subHeadings: [] };
      //console.debug(heading);
      groupedHeadings.push(lastH2);
    } else if (heading.level === 3 && lastH2) {
      lastH2.subHeadings.push(heading);
    }
  });

  return (
    <aside className='py-6 pr-4 sticky top-24 text-sm flex self-start shrink-0 flex-col max-w-52 overflow-y-auto extra-scrollbar overflow-x-hidden grow h-[calc(100vh-64px-3.5em)]'>
      <h2 className='text-lg font-bold text-neutral-300 mb-4'>
        Inhaltsverzeichnis
      </h2>

      {groupedHeadings.length === 0 ? (
        <p className='text-neutral-400'>Keine Überschriften gefunden.</p>
      ) : (
        <ul>
          {groupedHeadings.map((heading, index) => (
            <li key={index} className='py-2'>
              <Link
                href={`#${heading.id}`}
                className={`text-stone-500 hover:text-white text-sm font-bold ${
                  activeId === heading.id ? 'text-white' : ''
                }`}
              >
                {heading.text}
              </Link>
              {heading.subHeadings.length > 0 && (
                <ul className='ml-4 border-l border-neutral-700 pl-2 mt-1'>
                  {heading.subHeadings.map((subHeading, subIndex) => (
                    <li key={subIndex} className='py-1'>
                      <Link
                        href={`#${subHeading.id}`}
                        className={`text-stone-600 hover:text-white text-xs ${
                          activeId === subHeading.id ? 'text-white' : ''
                        }`}
                      >
                        {subHeading.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
