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
