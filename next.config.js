/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /HeartbeatWorker\.js$/,
      type: 'asset/source'
    });
    return config;
  }
};

module.exports = nextConfig;
