// Fragrance metadata derived from the EXISTING product schema.
// No duplicate fields are introduced: family/tags are inferred from the notes,
// season, gender and bestSeller data that products already carry. Products may
// optionally override with explicit `fragranceFamily` / `tags` arrays, which the
// admin can set — but nothing here requires them.

const FAMILY_RULES = [
  { key: "oud",    en: "Oud",    ar: "عود",    match: ["oud", "agarwood", "عود"] },
  { key: "woody",  en: "Woody",  ar: "خشبي",   match: ["wood", "sandal", "cedar", "vetiver", "guaiac", "خشب", "صندل", "أرز"] },
  { key: "floral", en: "Floral", ar: "زهري",   match: ["rose", "jasmine", "tuberose", "neroli", "iris", "gardenia", "peony", "ورد", "ياسمين", "زهر"] },
  { key: "citrus", en: "Citrus", ar: "حمضي",   match: ["bergamot", "lemon", "orange", "grapefruit", "citrus", "mandarin", "ليمون", "برتقال", "حمض"] },
  { key: "sweet",  en: "Sweet",  ar: "حلو",    match: ["vanilla", "praline", "caramel", "honey", "dates", "tonka", "فانيليا", "كراميل", "عسل", "تمر"] },
  { key: "spicy",  en: "Spicy",  ar: "توابل",  match: ["cinnamon", "nutmeg", "cardamom", "pepper", "saffron", "قرفة", "هيل", "زعفران", "فلفل"] },
  { key: "fresh",  en: "Fresh",  ar: "منعش",   match: ["mint", "aqua", "marine", "green", "ozonic", "نعناع", "بحري", "أخضر"] },
  { key: "amber",  en: "Amber",  ar: "عنبري",  match: ["amber", "resin", "olibanum", "incense", "عنبر", "بخور"] },
];

function allNotes(product) {
  const n = product.notes || {};
  return [...(n.top || []), ...(n.heart || []), ...(n.base || [])]
    .join(" ")
    .toLowerCase();
}

/** Primary fragrance family for a product, or null. */
export function fragranceFamily(product, lang = "en") {
  if (product.fragranceFamily) return product.fragranceFamily;
  const hay = allNotes(product);
  if (!hay) return null;
  const hit = FAMILY_RULES.find((r) => r.match.some((m) => hay.includes(m)));
  return hit ? (lang === "ar" ? hit.ar : hit.en) : null;
}

/** All families a product matches — used by the discovery filter. */
export function familyKeys(product) {
  if (Array.isArray(product.fragranceFamilyKeys)) return product.fragranceFamilyKeys;
  const hay = allNotes(product);
  return FAMILY_RULES.filter((r) => r.match.some((m) => hay.includes(m))).map((r) => r.key);
}

/** Short display tags for the product card (max 3, never breaks layout). */
export function productTags(product, lang = "en", t) {
  if (Array.isArray(product.tags) && product.tags.length) return product.tags.slice(0, 3);

  const out = [];
  const fam = fragranceFamily(product, lang);
  if (fam) out.push(fam);

  const seasons = product.season || [];
  if (seasons.length === 1) {
    const s = seasons[0];
    const map = { Summer: { en: "Summer", ar: "صيفي" }, Winter: { en: "Winter", ar: "شتوي" } };
    if (map[s]) out.push(lang === "ar" ? map[s].ar : map[s].en);
  }

  if (product.inspiredBy && t) out.push(lang === "ar" ? "مستوحى" : "Inspired");

  return out.slice(0, 3);
}

/** Discovery axes, inferred from existing data. */
export function isWarm(product) {
  const k = familyKeys(product);
  return k.some((x) => ["sweet", "spicy", "amber", "oud", "woody"].includes(x));
}
export function isFresh(product) {
  const k = familyKeys(product);
  return k.some((x) => ["fresh", "citrus"].includes(x));
}
export function isNight(product) {
  return (product.season || []).includes("Winter") || isWarm(product);
}
export function isDay(product) {
  return (product.season || []).includes("Summer") || isFresh(product);
}

export const FAMILIES = FAMILY_RULES.map(({ key, en, ar }) => ({ key, en, ar }));

// ─────────────────────────────────────────────────────────────
// Shop "collections" (المجموعة) — the four groups customers filter by.
// Each product belongs to one or more. The admin can set them explicitly
// (product.families); otherwise they are inferred from the notes using the
// detailed families above, so existing products work with no data entry.
// ─────────────────────────────────────────────────────────────
export const COLLECTIONS = [
  { key: "floral", en: "Floral", ar: "زهور", from: ["floral"],
    words: ["floral", "flower", "rose", "jasmine", "peony", "gardenia", "iris", "tuberose", "زهري", "زهور", "ورد", "ياسمين"] },
  { key: "woody", en: "Woody", ar: "أخشاب", from: ["woody", "oud"],
    words: ["wood", "cedar", "sandal", "oud", "vetiver", "guaiac", "خشب", "أخشاب", "عود", "صندل"] },
  { key: "fresh", en: "Fresh", ar: "منعش", from: ["fresh", "citrus"],
    words: ["fresh", "citrus", "aquatic", "marine", "green", "mint", "tea", "منعش", "حمضي", "حمضيات", "بحري"] },
  { key: "warm", en: "Warm", ar: "دافئ", from: ["sweet", "spicy", "amber", "oud"],
    words: ["warm", "sweet", "amber", "spice", "spiced", "vanilla", "honey", "gourmand", "oriental", "دافئ", "حلو", "عنبر", "توابل"] },
];
const COLLECTION_KEYS = new Set(COLLECTIONS.map((c) => c.key));

function tierFamilies(list) {
  const hay = (list || []).join(" ").toLowerCase();
  return FAMILY_RULES.filter((r) => r.match.some((m) => hay.includes(m))).map((r) => r.key);
}

/**
 * Collection keys for a product. An explicit admin choice (product.families)
 * always wins. Otherwise we score the product's own description of itself
 * (the tagline) highest, then heart/base notes, and top notes least — top
 * notes are mostly citrus and would otherwise make everything "fresh".
 */
export function collectionKeys(product) {
  if (Array.isArray(product?.families) && product.families.length) {
    return product.families.filter((k) => COLLECTION_KEYS.has(k));
  }
  if (!product || product.isDiscoverySet) return [];
  const tagline = `${product.tagline || ""} ${product.taglineAr || ""}`.toLowerCase();
  const n = product.notes || {};
  const top = tierFamilies(n.top);
  const deep = [...tierFamilies(n.heart), ...tierFamilies(n.base)];
  const scores = COLLECTIONS.map((c) => {
    let score = 0;
    if (c.words.some((w) => tagline.includes(w))) score += 3;
    score += deep.filter((f) => c.from.includes(f)).length;
    score += top.filter((f) => c.from.includes(f)).length * 0.5;
    return { key: c.key, score };
  });
  const max = Math.max(...scores.map((x) => x.score));
  if (max <= 0) return [];
  return scores.filter((x) => x.score >= Math.max(2, max * 0.75)).map((x) => x.key);
}
export function collectionLabel(key, lang) {
  const c = COLLECTIONS.find((x) => x.key === key);
  return c ? (lang === "ar" ? c.ar : c.en) : key;
}
