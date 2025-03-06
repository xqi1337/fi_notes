import { mdxComponents } from '@/components/mdxComponents'; // 🔥 Importiere benutzerdefinierte Komponenten
import { getAllArticles } from '@/utils/articles';
import { extractHeadings } from '@/utils/mdx';
import fs from 'fs';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import path from 'path';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

const contentDir = path.join(process.cwd(), 'content');

// 🔥 `getStaticProps` nutzt `extractHeadings()`
export async function getStaticProps({ params }) {
  const filePath = path.join(contentDir, `${params.slug.join('/')}.mdx`);

  if (!fs.existsSync(filePath)) {
    return { notFound: true };
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    },
  });

  const headings = extractHeadings(content) || []; // 🔥 Überschriften extrahieren
  const articles = getAllArticles() || []; // 🔥 Artikel für Sidebar

  return {
    props: {
      source: mdxSource,
      meta: data,
      slug: params.slug,
      headings,
      articles,
    },
  };
}

// 🔥 `getStaticPaths` wieder hinzufügen
export async function getStaticPaths() {
  const paths = getAllArticles().map((article) => ({
    params: { slug: article.slug.split('/').slice(1) },
  }));

  return { paths, fallback: false };
}

// 🔥 Artikel-Seite anzeigen
export default function PostPage({ source, meta, headings }) {
  return (
    <div className='p-6 mx-10 max-w-3xl'>
      <article className='prose prose-dark break-words'>
        <h1>{meta.title}</h1>
        <MDXRemote {...source} components={mdxComponents} />{' '}
        {/* 🔥 Hier werden die benutzerdefinierten Komponenten genutzt */}
      </article>
    </div>
  );
}
