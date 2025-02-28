import Link from 'next/link';

export default function Topics({ headings }) {
  return (
    <aside className='topics p-6 sticky top-25 h-fit'>
      <h2 className='text-lg font-bold text-white mb-4'>Inhaltsverzeichnis</h2>

      {headings.length === 0 ? (
        <p className='text-gray-500'>Keine Überschriften gefunden.</p>
      ) : (
        <ul>
          {headings.map((heading, index) => (
            <li key={index}>
              <Link
                href={`#${heading.id}`}
                className='text-blue-400 hover:underline'
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
