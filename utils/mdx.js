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
      console.debug(cleanText);
      cleanText = cleanText
        .replace(/\(.*?\)|\[.*?\]/g, '') // Entfernt `()` und `[]` samt Inhalt
        .replace(/[(){}\[\]]/g, '') // Entfernt übrig gebliebene Klammern
        .replace('&amp;', '&')
        .trim();

      // 🔥 Erstelle eine saubere `id`
      let headingId = cleanText
        .toLowerCase()
        .replace(/\s+/g, '-') // Ersetzt Leerzeichen mit `-`

        .replace(/&/g, '-')
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

export function extractContext(content, startIdx, endIdx, maxLength = 75) {
  if (!content) return '';

  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0); // 🔹 Zeilen aufteilen & leere entfernen

  // ✅ Finde die Zeile, die den Treffer enthält
  let matchedLine = lines.find((line) => {
    let lineStart = content.indexOf(line);
    let lineEnd = lineStart + line.length;
    return lineStart <= startIdx && lineEnd >= endIdx;
  });

  if (!matchedLine) return 'Kein Kontext gefunden';

  // 🔹 Falls die Zeile länger als `maxLength`, wird sie geschnitten & mit `...` versehen
  if (matchedLine.length > maxLength) {
    let matchPos = matchedLine
      .toLowerCase()
      .indexOf(content.slice(startIdx, endIdx).toLowerCase());

    let snippetStart = Math.max(0, matchPos - Math.floor(maxLength / 2));
    let snippetEnd = Math.min(matchedLine.length, snippetStart + maxLength);

    matchedLine = matchedLine.slice(snippetStart, snippetEnd).trim();

    if (snippetStart > 0)
      matchedLine = '...' + matchedLine.slice(matchedLine.indexOf(' '));
    if (snippetEnd < content.length)
      matchedLine = matchedLine.slice(0, matchedLine.lastIndexOf(' ')) + '...';
  }

  return matchedLine;
}
