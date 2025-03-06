/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    mdxRs: false, // Deaktiviert experimentellen MDX-Support in Next.js
    turbo: {}, // 🔥 TurboPack hat aktuell kein MDX-Support
  },
  pageExtensions: ['js', 'jsx', 'mdx'],
};

export default nextConfig;
