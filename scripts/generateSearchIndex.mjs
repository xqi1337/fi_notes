const mdxModule = await import(new URL('../utils/mdx.js', import.meta.url));
const { extractHeadings } = mdxModule;
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const contentDir = path.join(process.cwd(), 'content');
const searchIndexPath = path.join(process.cwd(), 'public', 'search-index.json');

const index = [];

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
      index.push({
        title: data.title || file.replace('.mdx', ''),
        slug,
        content,
        headings: extractHeadings(content) || [],
      });
    }
  });
}

// Index generieren und in `public/` speichern
readDirRecursive(contentDir);
fs.writeFileSync(searchIndexPath, JSON.stringify(index, null, 2));

console.log(`✅ Search index generated with ${index.length} entries`);