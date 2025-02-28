import { getAllArticles } from '@/utils/articles';

export async function getStaticProps() {
  const articles = getAllArticles();

  return {
    props: {
      articles,
    },
  };
}

export default function Home() {
  return (
    <div className='w-full p-6'>
      <h1 className='text-3xl font-bold mb-6'>Willkommen im IT Lernblog</h1>
      <p>Hier findest du alle IT-bezogenen Artikel.</p>
    </div>
  );
}
