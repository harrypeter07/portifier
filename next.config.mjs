/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['framer-motion'],
  experimental: {
    esmExternals: 'loose'
  }
};

export default nextConfig;
