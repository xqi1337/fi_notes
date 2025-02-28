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
    <>
      <h1 className='text-3xl font-bold mb-6'>Willkommen im IT Lernblog</h1>
      <p>Hier findest du alle IT-bezogenen Artikel.</p>
    </>
  );
}
