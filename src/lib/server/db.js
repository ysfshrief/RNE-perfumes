// Server-only database access (Neon Postgres). Never import from client code.
//
//   DATABASE_URL=postgres://…neon.tech/…   → Neon (production / preview)
//   DATABASE_URL=pglite://memory           → in-process Postgres (local tests)
//
// Tables are created on first use (idempotent), so a fresh Neon database
// works with no manual migration step.
//
//   rne_documents  key → jsonb       site settings: products, config, content
//   rne_records    (collection, id)  orders, customers
//   rne_users                        customer accounts (email + password hash)

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS rne_documents (
     key text PRIMARY KEY,
     data jsonb NOT NULL DEFAULT '{}'::jsonb,
     updated_at timestamptz NOT NULL DEFAULT now()
   )`,
  `CREATE TABLE IF NOT EXISTS rne_records (
     collection text NOT NULL,
     id text NOT NULL,
     data jsonb NOT NULL,
     created_at timestamptz NOT NULL DEFAULT now(),
     updated_at timestamptz NOT NULL DEFAULT now(),
     PRIMARY KEY (collection, id)
   )`,
  `CREATE INDEX IF NOT EXISTS rne_records_by_time ON rne_records (collection, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS rne_records_by_user ON rne_records (collection, (data->>'userId'))`,
  `CREATE TABLE IF NOT EXISTS rne_users (
     id text PRIMARY KEY,
     email text NOT NULL UNIQUE,
     name text,
     password_hash text NOT NULL,
     created_at timestamptz NOT NULL DEFAULT now()
   )`,
];

let dbPromise = null;

export function isDbConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

async function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw Object.assign(new Error("DATABASE_URL is not set"), { status: 503 });

  let db;
  if (url.startsWith("pglite:")) {
    // Local/testing only — a real Postgres engine in-process.
    const { PGlite } = await import("@electric-sql/pglite");
    const dir = url.slice("pglite://".length);
    const pg = new PGlite(dir && dir !== "memory" ? dir : undefined);
    const wrap = (c) => ({ query: async (text, params = []) => (await c.query(text, params)).rows });
    db = {
      ...wrap(pg),
      tx: (fn) => pg.transaction((tx) => fn(wrap(tx))),
    };
  } else {
    const { neon, Pool, neonConfig } = await import("@neondatabase/serverless");
    if (typeof globalThis.WebSocket === "undefined") {
      neonConfig.webSocketConstructor = (await import("ws")).default;
    }
    // Single statements go over HTTP (stateless, ideal for serverless).
    const sql = neon(url);
    db = {
      query: (text, params = []) => sql.query(text, params),
      // Interactive transactions need a session: open a short-lived pool
      // per transaction and always close it (serverless-safe).
      tx: async (fn) => {
        const pool = new Pool({ connectionString: url });
        const client = await pool.connect();
        try {
          await client.query("BEGIN");
          const out = await fn({ query: async (text, params = []) => (await client.query(text, params)).rows });
          await client.query("COMMIT");
          return out;
        } catch (e) {
          await client.query("ROLLBACK").catch(() => {});
          throw e;
        } finally {
          client.release();
          await pool.end().catch(() => {});
        }
      },
    };
  }

  for (const stmt of SCHEMA) await db.query(stmt);
  return db;
}

export function getDb() {
  if (!dbPromise) dbPromise = createDb().catch((e) => { dbPromise = null; throw e; });
  return dbPromise;
}

// ── Documents ──────────────────────────────────────────────
export async function getDocument(key, db) {
  const d = db || (await getDb());
  const rows = await d.query("SELECT data FROM rne_documents WHERE key = $1", [key]);
  return rows[0]?.data ?? null;
}

export async function putDocument(key, data, db) {
  const d = db || (await getDb());
  await d.query(
    `INSERT INTO rne_documents (key, data, updated_at) VALUES ($1, $2::jsonb, now())
     ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
    [key, JSON.stringify(data)]
  );
}

// ── Records ────────────────────────────────────────────────
export async function listRecords(collection, { userId, limit = 500 } = {}) {
  const d = await getDb();
  const rows = userId
    ? await d.query(
        "SELECT data FROM rne_records WHERE collection = $1 AND data->>'userId' = $2 ORDER BY created_at DESC LIMIT $3",
        [collection, userId, limit]
      )
    : await d.query("SELECT data FROM rne_records WHERE collection = $1 ORDER BY created_at DESC LIMIT $2", [collection, limit]);
  return rows.map((r) => r.data);
}

export async function upsertRecord(collection, record, db) {
  const d = db || (await getDb());
  await d.query(
    `INSERT INTO rne_records (collection, id, data, created_at, updated_at)
     VALUES ($1, $2, $3::jsonb, COALESCE(($3::jsonb->>'createdAt')::timestamptz, now()), now())
     ON CONFLICT (collection, id) DO UPDATE SET data = rne_records.data || EXCLUDED.data, updated_at = now()`,
    [collection, record.id, JSON.stringify(record)]
  );
}

export async function patchRecord(collection, id, patch) {
  const d = await getDb();
  const rows = await d.query(
    `UPDATE rne_records SET data = data || $3::jsonb, updated_at = now()
     WHERE collection = $1 AND id = $2 RETURNING data`,
    [collection, id, JSON.stringify(patch)]
  );
  return rows[0]?.data ?? null;
}

export async function deleteRecord(collection, id) {
  const d = await getDb();
  await d.query("DELETE FROM rne_records WHERE collection = $1 AND id = $2", [collection, id]);
}
