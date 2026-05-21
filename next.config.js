/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force rebuild without cache
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

module.exports = nextConfig;
