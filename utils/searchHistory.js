export function saveSearchQuery(query) {
  if (!query.trim()) return;

  let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
  searches = [query, ...searches.filter((q) => q !== query)].slice(0, 5); // 🔥 Max. 5 speichern
  localStorage.setItem('recentSearches', JSON.stringify(searches));
}

export function getRecentSearches() {
  return JSON.parse(localStorage.getItem('recentSearches')) || [];
}
