/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['framer-motion'],
  experimental: {
    serverComponentsExternalPackages: ['framer-motion']
  }
};

export default nextConfig;
