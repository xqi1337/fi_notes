export const mdxComponents = {
  h2: (props) => {
    const text = props.children;
    if (typeof text !== 'string') return <h2 {...props} />; // Falls `text` kein String ist, Standard-H2 behalten

    const id = text.toLowerCase().replace(/\s+/g, '-');
    return <h2 id={id} {...props} />;
  },
};
