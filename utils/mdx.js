import { marked } from 'marked';

// ✅ Einheitliche Funktion zur Markdown-Bereinigung
export function cleanMarkdown(content) {
  if (!content) return '';

  let cleanContent = marked.parse(content); // 🔥 Markdown → HTML konvertieren
  cleanContent = cleanContent.replace(/<[^>]*>/g, ''); // 🔥 Alle HTML-Tags entfernen

  return cleanContent.trim(); // 🔥 Zeilenumbrüche bleiben erhalten!
}

export function extractHeadings(mdxContent) {
  const lines = mdxContent.split('\n');
  const headings = [];

  lines.forEach((line) => {
    let matchH2 = line.match(/^##\s+(.*)/); // 🔥 `h2`-Überschriften
    let matchH3 = line.match(/^###\s+(.*)/); // 🔥 `h3`-Überschriften

    if (matchH2 || matchH3) {
      let headingText = matchH2 ? matchH2[1] : matchH3[1];

      // ✅ Einheitliche Markdown-Bereinigung
      let cleanText = cleanMarkdown(headingText);

      // 🔥 Entfernt `()` & `[]` samt Inhalt **nach** der Markdown-Bereinigung
      cleanText = cleanText
        .replace(/\(.*?\)|\[.*?\]/g, '') // Entfernt `()` und `[]` samt Inhalt
        .replace(/[(){}\[\]]/g, '') // Entfernt übrig gebliebene Klammern
        .trim();

      // 🔥 Erstelle eine saubere `id`
      let headingId = cleanText
        .toLowerCase()
        .replace(/\s+/g, '-') // Ersetzt Leerzeichen mit `-`
        .replace(/[^a-z0-9-]/g, '') // Entfernt Sonderzeichen außer `-`
        .replace(/-+$/, ''); // Entfernt `-` am Ende

      headings.push({
        text: cleanText, // 🔥 Bereinigter Text für Inhaltsverzeichnis
        id: headingId, // 🔥 Bereinigte ID für Anker
        level: matchH2 ? 2 : 3,
      });
    }
  });

  return headings;
}

export function extractContext(content, startIdx, endIdx) {
  if (!content) return '';

  const lines = content.split('\n'); // Inhalt in Zeilen aufteilen

  // ✅ Die Zeile finden, die den Treffer enthält
  let matchedLine = lines.find((line) => {
    let lineStart = content.indexOf(line);
    let lineEnd = lineStart + line.length;
    return lineStart <= startIdx && lineEnd >= endIdx;
  });

  return matchedLine ? matchedLine.trim() : 'Kein Kontext gefunden';
}

export function highlightMatch(text, query) {
  if (!text || !query || typeof text !== 'string') return text;

  try {
    // 🔥 Sonderzeichen in `query` escapen, damit Regex funktioniert
    const escapedQuery = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

    const regex = new RegExp(`(${escapedQuery})(?![^<]*>)`, 'gi'); // 🔥 Fix für Sonderzeichen
    return text.replace(
      regex,
      `<span class="bg-yellow-400 text-black font-bold">$1</span>`
    );
  } catch (error) {
    console.error('❌ Fehler in highlightMatch:', error);
    return text;
  }
}
