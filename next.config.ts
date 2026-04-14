import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  trailingSlash: false, // Helps SEO by resolving trailing slash URL duplication issues
  
  // A section dedicated to managing redirects
  async redirects() {
    return [
      // Example of a 301 Permanent Redirect
      // Use this if you change a URL or want to point a misspelled URL to the correct one
      // {
      //   source: '/about',
      //   destination: '/how-it-works',
      //   permanent: true, // true produces a 301 redirect (best for SEO passing link equity)
      // },
    ];
  },
};

export default nextConfig;
