import { extractHeadings } from '@/utils/mdx';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const contentDir = path.join(process.cwd(), 'content');
const searchIndexPath = path.join(process.cwd(), 'public', 'search-index.json');

// 🔥 Lädt alle Artikel & generiert JSON-Index
export default function handler(req, res) {
  let index = [];

  if (fs.existsSync(searchIndexPath)) {
    index = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));
  }

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

        const slug = `${parentSlug}/${file.replace('.mdx', '')}`;
        if (!index.some((a) => a.slug === slug)) {
          articles.push({
            title: data.title || file.replace('.mdx', ''),
            slug,
            content,
            headings: extractHeadings(content) || [],
          });
        }
      }
    });
  }

  readDirRecursive(contentDir);
  index.push(...articles);

  fs.writeFileSync(searchIndexPath, JSON.stringify(index, null, 2));
  res.status(200).json(index);
}
