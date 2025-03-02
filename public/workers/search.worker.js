import { cleanMarkdown, extractContext } from '@/utils/mdx';
import Fuse from 'fuse.js';

let fuse = null;

// 🔥 Empfängt den Index & bereinigt Inhalte
self.onmessage = (e) => {
  if (e.data.action === 'loadIndex') {
    const cleanedArticles = e.data.articles.map((article) => ({
      ...article,
      content: cleanMarkdown(article.content), // ✅ Inhalt bereinigt!
    }));

    fuse = new Fuse(cleanedArticles, {
      keys: [
        { name: 'title', weight: 0.8 },
        { name: 'headings.text', weight: 0.1 },
        { name: 'content', weight: 0.1 },
      ],
      includeMatches: true,
      threshold: 0.3, // 🔥 Genauere Suche
      distance: 5,
      ignoreLocation: false,
      useExtendedSearch: true,
    });

    self.postMessage({ action: 'ready' });
  }

  // 🔍 Suche starten
  if (e.data.action === 'search' && fuse) {
    const searchQuery = `"${e.data.query}"`;
    const results = fuse.search(searchQuery);
    const groupedResults = groupResults(results);

    // ✅ Korrektes Debugging
    console.debug(
      '🔥 Gruppierte Ergebnisse:',
      JSON.stringify(groupedResults, null, 2)
    );

    self.postMessage({ action: 'results', results: groupedResults });
  }
};

// 🔍 Gruppiert die Suchergebnisse nach Artikel-Titel
function groupResults(results) {
  return results.reduce((acc, result) => {
    const articleTitle = result.item.title;
    const articleSlug = result.item.slug;

    if (!acc[articleTitle]) {
      acc[articleTitle] = [];
    }

    result.matches.forEach((match) => {
      if (Array.isArray(match.indices)) {
        match.indices.forEach(([start, end]) => {
          let snippet = extractContext(result.item.content, start, end);

          // ✅ Verhindert doppelte Einträge
          if (!acc[articleTitle].some((entry) => entry.match === snippet)) {
            acc[articleTitle].push({
              item: { title: articleTitle, slug: articleSlug }, // 🚀 Fix: Artikelinfo wieder hinzufügen
              match: snippet,
            });
          }
        });
      }
    });

    return acc;
  }, {});
}
