import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { extractHeadings } from './mdx';

const contentDir = path.join(process.cwd(), 'content');

// 🔥 Lädt alle Artikel mit `title`, `content` & `headings`
export function getAllArticles() {
  const articles = [];

  function readDirRecursive(dir, parentSlug = '') {
    fs.readdirSync(dir).forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        readDirRecursive(filePath, `${parentSlug}/${file}`);
      } else if (file.endsWith('.mdx')) {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        articles.push({
          title: data.title || file.replace('.mdx', ''),
          slug: `${parentSlug}/${file.replace('.mdx', '')}`,
          content: content, // 🔥 Fügt den ganzen Artikeltext zur Suche hinzu
          headings: extractHeadings(content) || [],
        });
      }
    });
  }

  readDirRecursive(contentDir);
  return articles;
}
