// Which data backend the browser talks to.
//   NEXT_PUBLIC_BACKEND=neon  → the site's /api routes (Neon Postgres)
//   (unset)                   → local demo mode (this browser's storage only)
export const isRemote = process.env.NEXT_PUBLIC_BACKEND === "neon";
