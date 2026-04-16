/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["firebase", "firebase-admin"],
  images: {
    domains: ["assets.adidas.com"],
  },
}
module.exports = nextConfig