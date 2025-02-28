export function searchArticles(query, articles) {
  if (!query) return articles; // Wenn kein Suchbegriff, zeige alle Artikel

  const lowerQuery = query.toLowerCase();

  return articles.filter(
    (article) =>
      article.title.toLowerCase().includes(lowerQuery) ||
      (article.text && article.text.includes(lowerQuery))
  );
}
