import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';

export const mdxOptions = {
  remarkPlugins: [remarkMath, remarkGfm],
  rehypePlugins: [rehypeKatex],
};
