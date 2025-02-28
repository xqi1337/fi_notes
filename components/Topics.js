import Link from 'next/link';

export default function Topics({ headings }) {
  return (
    <aside className='py-6 pr-4 sticky top-24 text-sm flex self-start shrink-0 flex-col max-w-64 overflow-y-auto extra-scrollbar overflow-x-hidden grow h-[calc(100vh-64px-3.5em)]'>
      <h2 className='text-lg font-bold text-gray-300 mb-4'>
        Inhaltsverzeichnis
      </h2>

      {headings.length === 0 ? (
        <p className='text-gray-400'>Keine Überschriften gefunden.</p>
      ) : (
        <ul>
          {headings.map((heading, index) => (
            <li key={index} className='py-2'>
              <Link
                href={`#${heading.id}`}
                className='text-gray-400 hover:text-white text-sm font-bold'
              >
                {heading.text}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
