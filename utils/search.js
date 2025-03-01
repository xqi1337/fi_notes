import Fuse from 'fuse.js';

// 🔥 Erstellt den Suchindex mit vollständigem Inhalt
export function createSearchIndex(articles) {
  if (!Array.isArray(articles) || articles.length === 0) return null;

  return new Fuse(articles, {
    keys: [
      { name: 'title', weight: 0.5 }, // Titel hat hohe Relevanz
      { name: 'content', weight: 0.4 }, // Kompletter Artikeltext
      { name: 'headings.text', weight: 0.1 }, // Überschriften haben niedrigere Relevanz
    ],
    includeMatches: true,
    threshold: 0.3,
    distance: 100,
  });
}

// 🔍 Fuzzy-Suche mit Highlighting
export function searchArticles(query, fuse) {
  if (!query.trim() || !fuse) return [];

  const results = fuse.search(query).map(({ item, matches = [] }) => {
    // 🔥 Highlighting für Titel, Überschriften & Inhalt
    const highlightedTitle = highlightMatches(item.title, matches, 'title');
    const highlightedContent = highlightMatches(
      item.content,
      matches,
      'content'
    );
    const highlightedHeadings = (item.headings || []).map((h) =>
      highlightMatches(h.text, matches, 'headings.text')
    );

    return {
      ...item,
      highlightedTitle,
      highlightedContent,
      highlightedHeadings,
    };
  });

  return results;
}

// 🔥 Highlight-Funktion mit Sicherheitschecks
function highlightMatches(text, matches, key) {
  if (!text || !matches || !Array.isArray(matches)) return text;

  const match = matches.find((m) => m.key === key);
  if (!match || !Array.isArray(match.indices)) return text;

  let highlightedText = '';
  let lastIndex = 0;

  match.indices.forEach(([start, end]) => {
    highlightedText +=
      text.substring(lastIndex, start) +
      `<span class="bg-yellow-500 text-black">${text.substring(
        start,
        end + 1
      )}</span>`;
    lastIndex = end + 1;
  });

  highlightedText += text.substring(lastIndex);
  return highlightedText;
}
