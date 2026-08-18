/**
 * Grant admin rights to a user (sets the custom claim `admin: true`).
 *
 * Prerequisites:
 *   1. Firebase Console → Project settings → Service accounts →
 *      "Generate new private key" → save as `serviceAccountKey.json` in the
 *      project root (this file is git-ignored — never commit it).
 *   2. The user must already exist in Firebase Authentication (they can just
 *      register on the site once).
 *
 * Usage:
 *   node scripts/setAdmin.mjs someone@example.com
 *
 * After running, the user must sign out and back in for the claim to take effect.
 */

import { readFileSync } from "node:fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/setAdmin.mjs <email>");
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync("./serviceAccountKey.json", "utf8"));
initializeApp({ credential: cert(serviceAccount) });

const auth = getAuth();
const user = await auth.getUserByEmail(email);
await auth.setCustomUserClaims(user.uid, { admin: true });
console.log(`✅ ${email} is now an admin. They must sign out and back in.`);
process.exit(0);
