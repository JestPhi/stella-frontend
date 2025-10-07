/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable standalone output for Docker optimization
  output: "standalone",
  // Configure request body size limits for file uploads
  experimental: {
    serverComponentsExternalPackages: [],
    bodySizeLimit: "5mb", // Set maximum request body size to 5MB
  },
  images: {
    // Restrict to specific trusted domains for security
    domains: [
      "localhost",
      "firebasestorage.googleapis.com", // Firebase Storage
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/*/o/**",
      },
      {
        protocol: "https",
        hostname: "link.storjshare.io", // Storj CDN
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "gateway.storjshare.io", // Alternative Storj gateway
        pathname: "/**",
      },
      // Add your specific CDN domains here as needed
      // Do NOT use wildcards like "**" for security
    ],
  },
  // Only expose truly public environment variables
  // Note: Firebase config variables are safe to expose (they're meant to be public)
  env: {
    // Public frontend URLs - safe to expose
    NEXT_PUBLIC_STORJ_PUBLIC_URL: process.env.NEXT_PUBLIC_STORJ_PUBLIC_URL,
    NEXT_PUBLIC_STELLA_REACT_NATIVE_FOR_WEB_HOST:
      process.env.NEXT_PUBLIC_STELLA_REACT_NATIVE_FOR_WEB_HOST,

    // Firebase configuration - safe to expose (meant to be public)
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,

    // Remove NEXT_PUBLIC_STELLA_BACKEND_HOST - this should only be used server-side
    // Use STELLA_BACKEND_HOST (without NEXT_PUBLIC_) for server-side API calls
  },
  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.gstatic.com https://apis.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.firebaseio.com; frame-src 'self' https://*.firebaseapp.com; object-src 'none';",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
