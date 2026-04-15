/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: [
    "@remotion/bundler",
    "@remotion/renderer",
    "@remotion/cli",
    "puppeteer-core",
    "puppeteer",
    "esbuild",
  ],
};

module.exports = nextConfig;
