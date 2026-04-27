/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["firebase", "firebase-admin"],
  allowedDevOrigins: ["192.168.56.1"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.adidas.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // avatar Google
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // avatar GitHub
      },
    ],
  },
}
module.exports = nextConfig
