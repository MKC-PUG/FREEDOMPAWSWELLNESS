/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@imgly/background-removal'],
  outputFileTracingExcludes: {
    '*': ['./public/imgly-bg-removal/**/*'],
  },
  outputFileTracingIncludes: {
    '/ops/desk': ['./docs/ops/Studio-Production-Click-by-Click.md'],
    '/ops/marketing': ['./docs/ops/SuperBud-Distribution-Click-by-Click.md'],
    '/api/ops/superbud-manual': [
      './docs/\\(UPDATED 10-24-26\\) Freedom-Paws-SuperBud-Page-Click-by-Click-Manual.pdf',
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'framerusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  async redirects() {
    return [
      // Short aliases people type / share (Framer + outreach often omit the full path)
      {
        source: '/partners',
        destination: '/wellness/partners',
        permanent: false,
      },
      {
        source: '/parters',
        destination: '/wellness/partners',
        permanent: false,
      },
      {
        source: '/shelter',
        destination: '/id/shelter',
        permanent: false,
      },
      {
        source: '/shelters',
        destination: '/adopt/tn',
        permanent: false,
      },
      {
        source: '/grants',
        destination: 'https://freedompawsinc.com/grants',
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/diagnostics',
        headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }],
      },
      {
        source: '/monitor',
        headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }],
      },
      {
        source: '/api/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }],
      },
      {
        source: '/offline.html',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
      },
    ];
  },
};

export default nextConfig;