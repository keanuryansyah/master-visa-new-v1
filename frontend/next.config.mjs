/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: 'standalone',
  reactCompiler: true,
  env: {
    // NEXT_PUBLIC_API_URL: 'http://localhost:4000',
    NEXT_PUBLIC_API_URL: 'https://be.mastervisaku.com',
  },
};

export default nextConfig;
