/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["firebase", "firebase-admin"],
  allowedDevOrigins: ["192.168.56.1"],
}
module.exports = nextConfig
