export function extractHeadings(mdxContent) {
  const lines = mdxContent.split('\n');
  const headings = [];

  lines.forEach((line) => {
    let matchH2 = line.match(/^##\s+(.*)/); // 🔥 `h2`-Überschriften
    let matchH3 = line.match(/^###\s+(.*)/); // 🔥 `h3`-Überschriften

    if (matchH2 || matchH3) {
      let headingText = matchH2 ? matchH2[1] : matchH3[1];

      // 🔥 Entfernt alles in `()` oder `[]`, Klammern & HTML-Tags
      let cleanText = headingText
        .replace(/\(.*?\)|\[.*?\]/g, '') // Entfernt `()` und `[]` samt Inhalt
        .replace(/[(){}\[\]]/g, '') // Entfernt übrig gebliebene Klammern
        .replace(/<\/?[^>]+(>|$)/g, '') // Entfernt HTML-Tags (z. B. `<a>`)
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
