/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // No transpilePackages needed — frontend no longer imports quran-json
}

export default nextConfig
