/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The browser uses the database automatically whenever the deployment has
  // a DATABASE_URL (e.g. added by Vercel's Neon integration). Without it the
  // site runs in local demo mode. Can be forced with NEXT_PUBLIC_BACKEND.
  env: {
    NEXT_PUBLIC_BACKEND:
      process.env.NEXT_PUBLIC_BACKEND ?? (process.env.DATABASE_URL ? "neon" : ""),
  },
  experimental: {
    // Server-only database drivers: load from node_modules at runtime
    // instead of being bundled into the API routes.
    serverComponentsExternalPackages: ["@neondatabase/serverless", "ws", "@electric-sql/pglite"],
  },
};

module.exports = nextConfig;
