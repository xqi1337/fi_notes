import Image from 'next/image';
import TableLF1_01 from './content/TableLF1_01';
import DataToolsTabs from './tools/DataToolsTabs';

export const mdxComponents = {
  h2: ({ children, ...props }) => {
    let text = extractText(children);
    const id = generateId(text);

    return (
      <h2 id={id} {...props}>
        {children}
      </h2>
    );
  },

  h3: ({ children, ...props }) => {
    let text = extractText(children);
    const id = generateId(text);
    return (
      <h3 id={id} {...props}>
        {children}
      </h3>
    );
  },

  TableLF1_01,
  img: ({ src, alt, ...props }) => {
    return (
      <Image
        src={src}
        alt={alt || 'Bild'}
        width={800} // Standardgröße anpassen
        height={450} // Seitenverhältnis beibehalten
        style={{ maxWidth: '100%', height: 'auto' }}
        {...props}
      />
    );
  },
  DataToolsTabs
};

// 🔥 Extrahiert reinen Text aus React-Elementen (z. B. `<a>`)
function extractText(children) {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractText).join(' ');
  if (typeof children === 'object' && children.props)
    return extractText(children.props.children);
  return '';
}

// 🔥 Generiert eine saubere `id`
function generateId(text) {
  return text
    .replace(/\(.*?\)|\[.*?\]/g, '') // Entfernt alles in `()` oder `[]`
    .replace(/[(){}\[\]]/g, '') // Entfernt übrig gebliebene Klammern
    .replace(/<\/?[^>]+(>|$)/g, '') // Entfernt HTML-Tags
    .replace(/&/g, '-')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') // Ersetzt Leerzeichen mit `-`
    .replace(/\s+/g, '-') // Ersetzt Leerzeichen mit `-`
    .replace(/[^a-z0-9-]/g, '') // Entfernt Sonderzeichen außer `-`
    .replace(/-+$/, ''); // Entfernt `-` am Ende
}
