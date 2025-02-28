import Link from 'next/link';

export default function Sidebar({ articles }) {
  // 🔥 Artikel nach Kategorien gruppieren
  const categories = {};
  articles.forEach((article) => {
    if (!categories[article.category]) {
      categories[article.category] = [];
    }
    categories[article.category].push(article);
  });

  return (
    <aside className='w-1/6 p-6 border-r border-gray-700'>
      <h2 className='text-lg font-bold text-white mb-4'>Navigation</h2>

      {/* 🔥 Durch die Kategorien iterieren */}
      {Object.keys(categories).map((category, index) => (
        <div key={index} className='mb-4'>
          {/* 🔥 Kategorie-Überschrift */}
          <h3 className='text-md font-bold text-gray-300 mb-2'>{category}</h3>
          <ul>
            {categories[category].map((article, idx) => (
              <li key={idx}>
                <Link
                  href={article.slug}
                  className='text-blue-400 hover:underline'
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
