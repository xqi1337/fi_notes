export const handleSearch = (
  query,
  setQuery,
  saveSearchQuery,
  setRecentSearches,
  getRecentSearches
) => {
  setQuery(query);
  saveSearchQuery(query);
  setRecentSearches(getRecentSearches()); // 🔥 Suchhistorie sofort aktualisieren
};

export const handleKeyDown = (
  e,
  results,
  selectedIndex,
  setSelectedIndex,
  handleSearchSelection,
  query,
  router,
  setQuery,
  setResults,
  saveSearchQuery,
  getRecentSearches,
  itemRefs // 🔥 Jetzt übergeben wir itemRefs!
) => {
  if (!results || Object.keys(results).length === 0) return;

  const allResults = Object.values(results).flat(); // 🔥 Konvertiere `results` in ein Array
  const totalResults = allResults.length; // 🔥 Jetzt gibt es eine echte `length`

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    setSelectedIndex((prev) => {
      const newIndex = prev === -1 ? 0 : Math.min(prev + 1, totalResults - 1);

      // 🔥 Warte kurz, bis das DOM geupdated ist, dann scrollen
      setTimeout(() => {
        if (itemRefs && itemRefs.current && itemRefs.current[newIndex]) {
          itemRefs.current[newIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        } else {
          console.warn(
            'itemRefs oder itemRefs.current[newIndex] ist undefined:',
            itemRefs
          );
        }
      }, 0);

      return newIndex;
    });
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    setSelectedIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : prev;

      setTimeout(() => {
        if (itemRefs && itemRefs.current && itemRefs.current[newIndex]) {
          itemRefs.current[newIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        } else {
          console.warn(
            'itemRefs oder itemRefs.current[newIndex] ist undefined:',
            itemRefs
          );
        }
      }, 0);

      return newIndex;
    });
  } else if (e.key === 'Enter' && selectedIndex >= 0) {
    handleSearchSelection(
      query,
      allResults[selectedIndex].item.slug,
      saveSearchQuery,
      getRecentSearches,
      router
    );
  } else if (e.key === 'Escape') {
    setQuery('');
    setResults([]);
  }
};

export const handleSearchSelection = (
  query,
  slug,
  saveSearchQuery,
  getRecentSearches,
  router
) => {
  saveSearchQuery(query);
  getRecentSearches(); // 🔥 Historie aktualisieren
  router.push(slug); // 🔥 Statt `window.location.href`
};
