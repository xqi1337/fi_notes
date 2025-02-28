/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    mdxRs: false, // Deaktiviert den fehlerhaften MDX-Loader
  },
  pageExtensions: ['js', 'jsx', 'mdx'],
};

export default nextConfig;
