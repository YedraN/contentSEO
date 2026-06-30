/** @type {import('next').NextConfig} */
const nextConfig = {
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

module.exports = nextConfig;
