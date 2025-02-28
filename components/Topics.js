import Link from 'next/link';

export default function Topics({ headings }) {
  return (
    <aside className='py-6  sticky top-24 h-fit self-start'>
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
