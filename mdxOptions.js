import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

export const mdxOptions = {
  remarkPlugins: [remarkMath], // 🔥 Unterstützt mathematische Formeln in MDX
  rehypePlugins: [rehypeKatex], // 🔥 Wandelt Formeln in HTML mit KaTeX um
};
