import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const contentDir = path.join(process.cwd(), 'content');

// 🔥 Gemeinsame Funktion, um alle MDX-Artikel zu laden
export function getAllArticles(dir = contentDir, parentSlug = []) {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let articles = [];

  entries.forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    const slug = [...parentSlug, entry.name.replace(/\.mdx$/, '')];

    if (entry.isDirectory()) {
      articles = [...articles, ...getAllArticles(fullPath, slug)];
    } else if (entry.name.endsWith('.mdx')) {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      articles.push({
        slug: `/${slug.join('/')}`, // URL des Artikels
        title: data.title || slug[slug.length - 1], // Falls kein Titel existiert, nutze den Dateinamen
        category: parentSlug[0]?.replace(/_/g, ' ') || 'Allgemein', // 🔥 Unterstrich zu Leerzeichen ersetzen
        text: content ? content.toLowerCase() : '', // **MDX-Inhalt als Suchtext speichern**
      });
    }
  });

  return articles;
}
