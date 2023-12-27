const path = require("node:path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["ui", "icons"],
  output: "standalone",
  swcMinify: true,
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../../"),
    optimizePackageImports: ["ui", "icons"],
  },
};

module.exports = nextConfig;
