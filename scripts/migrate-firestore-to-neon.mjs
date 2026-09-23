/**
 * One-off: copy the old Firebase data into Neon.
 *
 * Only needed if the live site ever saved data to Firestore (products edits,
 * site texts, settings, orders, customers). Safe to re-run — it upserts.
 *
 * 1. npm i --no-save firebase-admin
 * 2. Put the Firebase service-account JSON at ./serviceAccountKey.json
 *    (never commit it — it is git-ignored).
 * 3. DATABASE_URL="postgres://…neon.tech/…" node scripts/migrate-firestore-to-neon.mjs
 */
import { readFileSync } from "node:fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) { console.error("Set DATABASE_URL first."); process.exit(1); }
const sql = neon(url);

await sql.query(`CREATE TABLE IF NOT EXISTS rne_documents (key text PRIMARY KEY, data jsonb NOT NULL DEFAULT '{}'::jsonb, updated_at timestamptz NOT NULL DEFAULT now())`);
await sql.query(`CREATE TABLE IF NOT EXISTS rne_records (collection text NOT NULL, id text NOT NULL, data jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (collection, id))`);

initializeApp({ credential: cert(JSON.parse(readFileSync("./serviceAccountKey.json", "utf8"))) });
const fs = getFirestore();

for (const key of ["content", "config", "products"]) {
  const snap = await fs.doc(`settings/${key}`).get();
  if (!snap.exists) { console.log(`settings/${key}: (none)`); continue; }
  await sql.query(
    `INSERT INTO rne_documents (key, data) VALUES ($1, $2::jsonb)
     ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
    [key, JSON.stringify(snap.data())]
  );
  console.log(`settings/${key}: copied`);
}

for (const col of ["orders", "customers"]) {
  const snap = await fs.collection(col).get();
  for (const d of snap.docs) {
    const data = { id: d.id, ...d.data() };
    await sql.query(
      `INSERT INTO rne_records (collection, id, data, created_at)
       VALUES ($1, $2, $3::jsonb, COALESCE(($3::jsonb->>'createdAt')::timestamptz, now()))
       ON CONFLICT (collection, id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
      [col, data.id, JSON.stringify(data)]
    );
  }
  console.log(`${col}: ${snap.size} copied`);
}
console.log("✅ Done. Customer passwords can't be copied from Firebase Auth — customers create a new account (their past orders stay linked by email in the admin).");
process.exit(0);
