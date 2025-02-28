import Link from 'next/link';

const RelatedArticles = ({ category }) => {
  const articles = {
    Lernfeld1: [
      { title: 'Einführung', slug: '/Lernfeld1/einführung' },
      { title: 'Arbeitsrecht', slug: '/Lernfeld1/arbeitsrecht' },
    ],
    Lernfeld2: [
      { title: 'LF2-1', slug: '/Lernfeld2/LF2-1' },
      { title: 'LF2-2', slug: '/Lernfeld2/LF2-2' },
    ],
  };

  return (
    <div>
      <h2 className='text-lg font-bold mb-2'>Weitere Artikel</h2>
      <ul>
        {articles[category]?.map((article) => (
          <li key={article.slug}>
            <Link href={article.slug}>{article.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedArticles;
