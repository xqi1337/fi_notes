import { getAllArticles } from '@/utils/articles';
import fs from 'fs';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import path from 'path';

const contentDir = path.join(process.cwd(), 'content');

// Funktion, um den Inhalt eines einzelnen MDX-Artikels zu laden
export async function getStaticProps({ params }) {
  const filePath = path.join(contentDir, `${params.slug.join('/')}.mdx`);

  if (!fs.existsSync(filePath)) {
    return { notFound: true };
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const mdxSource = await serialize(content);

  const articles = getAllArticles(); // 🔥 **Artikel-Liste aus Utility-Funktion laden**

  return {
    props: {
      source: mdxSource,
      meta: data,
      slug: params.slug,
      articles, // 🔥 **Jetzt überall verfügbar**
    },
  };
}

// Alle verfügbaren Artikel als Routen generieren
export async function getStaticPaths() {
  const paths = getAllArticles().map((article) => ({
    params: { slug: article.slug.split('/').slice(1) },
  }));

  return { paths, fallback: false };
}

// Die eigentliche Artikel-Seite
export default function PostPage({ source, meta }) {
  return (
    <>
      <article className='prose prose-dark max-w-none'>
        <h1>{meta.title}</h1>
        <MDXRemote {...source} />
      </article>
    </>
  );
}
