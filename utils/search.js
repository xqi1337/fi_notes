export function highlightMatch(text, query) {
  if (!text || !query || typeof text !== 'string') return text;

  try {
    // 🔥 Sonderzeichen in `query` escapen, damit Regex funktioniert
    const escapedQuery = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

    const regex = new RegExp(`(${escapedQuery})(?![^<]*>)`, 'gi'); // 🔥 Fix für Sonderzeichen
    return text.replace(
      regex,
      `<span class=" text-blue-400 font-bold">$1</span>`
    );
  } catch (error) {
    console.error('❌ Fehler in highlightMatch:', error);
    return text;
  }
}
