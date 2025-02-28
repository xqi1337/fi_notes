export function extractHeadings(mdxContent) {
  const lines = mdxContent.split('\n');
  const headings = [];

  lines.forEach((line) => {
    const match = line.match(/^##\s+(.*)/); // 🔥 Findet alle `## Überschriften`
    if (match) {
      const headingText = match[1];
      const headingId = headingText.toLowerCase().replace(/\s+/g, '-'); // 🔗 ID für Ankerlink generieren
      headings.push({ text: headingText, id: headingId });
    }
  });

  return headings;
}
