/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["firebase", "firebase-admin"],
}
module.exports = nextConfig
