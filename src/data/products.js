// RNE Perfumes catalog.
// Products are based on the RNE lineup. Each product has an `image` field:
//   - a color hex (e.g. "#1a1a1a") renders an elegant placeholder bottle
//   - a URL (https://...) renders the real product photo
// The admin can replace image placeholders with real URLs from the dashboard.
// Front-end only — in production this comes from the backend / admin dashboard.

export const products = [
  {
    id: "rne-01",
    slug: "khamrah",
    name: "Khamrah",
    inspiredBy: "Lattafa Khamrah",
    tagline: "Sweet spiced amber with dates and vanilla",
    description:
      "A warm, gourmand oriental built around candied dates, cinnamon and praline, resting on a rich base of amber, tonka and vanilla. Cozy, sweet, and unmistakably luxurious — a signature for cold evenings.",
    gender: "Unisex",
    season: ["Winter"],
    notes: {
      top: ["Cinnamon", "Nutmeg", "Bergamot"],
      heart: ["Dates", "Praline", "Tuberose"],
      base: ["Vanilla", "Tonka Bean", "Amber"],
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Aqua, Coumarin, Linalool.",
    sizes: [
      { size: "30ml", price: 650, oldPrice: 780, stock: 14 },
      { size: "50ml", price: 950, oldPrice: null, stock: 8 },
      { size: "100ml", price: 1420, oldPrice: null, stock: 6 },
    ],
    rating: 4.8,
    reviewCount: 47,
    bestSeller: true,
    image: "/products/khamrah.jpg",
    images: ["/products/khamrah.jpg"],
  },
  {
    id: "rne-02",
    slug: "scandal",
    name: "Scandal",
    inspiredBy: "Jean Paul Gaultier Scandal",
    tagline: "Honeyed floral with caramel and gardenia",
    description:
      "A bold, sweet floral centred on honey and blood orange, blooming into gardenia and jasmine, finished with caramel and patchouli. Feminine, magnetic, and made to be noticed.",
    gender: "Women",
    season: ["Summer", "Winter"],
    notes: {
      top: ["Blood Orange", "Mandarin"],
      heart: ["Gardenia", "Jasmine", "Honey"],
      base: ["Caramel", "Patchouli", "Vanilla"],
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Aqua, Benzyl Salicylate, Citronellol.",
    sizes: [
      { size: "30ml", price: 720, oldPrice: null, stock: 18 },
      { size: "50ml", price: 1080, oldPrice: 1250, stock: 6 },
      { size: "100ml", price: 1620, oldPrice: null, stock: 6 },
    ],
    rating: 4.7,
    reviewCount: 39,
    bestSeller: true,
    image: "https://drive.google.com/file/d/14-BqsKCeJUIjdhC2-Rok1kXV_3smo_WD/view",
    images: ["https://drive.google.com/file/d/14-BqsKCeJUIjdhC2-Rok1kXV_3smo_WD/view", "/products/scandal.jpg"],
  },
  {
    id: "rne-03",
    slug: "pacific-chill",
    name: "Pacific Chill",
    inspiredBy: "Louis Vuitton Pacific Chill",
    tagline: "Fresh citrus with mint and blackcurrant",
    description:
      "A crisp, energetic citrus: lemon and mandarin lifted by mint and blackcurrant, over a clean musky base. Bright and refreshing — the perfect summer daytime companion.",
    gender: "Unisex",
    season: ["Summer"],
    notes: {
      top: ["Lemon", "Mandarin", "Bergamot"],
      heart: ["Mint", "Blackcurrant", "Coriander Seed"],
      base: ["Cedar", "White Musk"],
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Aqua, Limonene, Linalool.",
    sizes: [
      { size: "30ml", price: 680, oldPrice: null, stock: 20 },
      { size: "50ml", price: 990, oldPrice: null, stock: 0 },
      { size: "100ml", price: 1480, oldPrice: null, stock: 6 },
    ],
    rating: 4.6,
    reviewCount: 28,
    bestSeller: false,
    image: "/products/pacific-chill.jpg",
    images: ["/products/pacific-chill.jpg"],
  },
  {
    id: "rne-04",
    slug: "imagination",
    name: "Imagination",
    inspiredBy: "Louis Vuitton Imagination",
    tagline: "Citrus tea with ginger and warm woods",
    description:
      "An elegant, airy composition: bergamot and orange over black tea and ginger, resting on ambroxan and guaiac wood. Refined and versatile — clean sophistication for any occasion.",
    gender: "Men",
    season: ["Summer", "Winter"],
    notes: {
      top: ["Bergamot", "Orange", "Lemon"],
      heart: ["Black Tea", "Ginger", "Ceylon Cinnamon"],
      base: ["Ambroxan", "Guaiac Wood", "Olibanum"],
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Aqua, Limonene, Linalool.",
    sizes: [
      { size: "30ml", price: 700, oldPrice: null, stock: 15 },
      { size: "50ml", price: 1020, oldPrice: 1180, stock: 5 },
      { size: "100ml", price: 1530, oldPrice: null, stock: 6 },
    ],
    rating: 4.8,
    reviewCount: 42,
    bestSeller: true,
    image: "/products/imagination.jpg",
    images: ["/products/imagination.jpg"],
  },
  {
    id: "rne-05",
    slug: "bleu-de-chanel",
    name: "Bleu",
    inspiredBy: "Bleu de Chanel",
    tagline: "Aromatic woody with citrus and incense",
    description:
      "A timeless masculine signature: fresh grapefruit and bergamot over mint and pink pepper, grounded in cedar, incense and sandalwood. Confident, clean, and endlessly wearable.",
    gender: "Men",
    season: ["Summer", "Winter"],
    notes: {
      top: ["Grapefruit", "Bergamot", "Lemon"],
      heart: ["Mint", "Pink Pepper", "Nutmeg"],
      base: ["Incense", "Cedar", "Sandalwood"],
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Aqua, Limonene, Coumarin.",
    sizes: [
      { size: "30ml", price: 730, oldPrice: null, stock: 22 },
      { size: "50ml", price: 1080, oldPrice: null, stock: 9 },
      { size: "100ml", price: 1620, oldPrice: null, stock: 6 },
    ],
    rating: 4.9,
    reviewCount: 63,
    bestSeller: true,
    image: "https://drive.google.com/file/d/1cBnMAwHoUt0cO7hSoZsSpf80FvhFlH8Y/view",
    images: ["https://drive.google.com/file/d/1cBnMAwHoUt0cO7hSoZsSpf80FvhFlH8Y/view", "/products/bleu-de-chanel.jpg"],
  },
  {
    id: "rne-06",
    slug: "sauvage",
    name: "Sauvage",
    inspiredBy: "Dior Sauvage",
    tagline: "Fresh spicy with pepper and ambroxan",
    description:
      "A powerful, radiant fougère: bright bergamot over Sichuan pepper and lavender, driven by a signature ambroxan and cedar base. Bold and magnetic — an everyday power scent.",
    gender: "Men",
    season: ["Summer", "Winter"],
    notes: {
      top: ["Bergamot", "Sichuan Pepper"],
      heart: ["Lavender", "Star Anise", "Nutmeg"],
      base: ["Ambroxan", "Cedar", "Vanilla"],
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Aqua, Limonene, Coumarin.",
    sizes: [
      { size: "30ml", price: 730, oldPrice: 850, stock: 25 },
      { size: "50ml", price: 1080, oldPrice: null, stock: 11 },
      { size: "100ml", price: 1620, oldPrice: null, stock: 6 },
    ],
    rating: 4.9,
    reviewCount: 71,
    bestSeller: true,
    image: "/products/sauvage.jpg",
    images: ["/products/sauvage.jpg"],
  },
  {
    id: "rne-07",
    slug: "miss-dior",
    name: "Miss",
    inspiredBy: "Miss Dior",
    tagline: "Romantic floral with rose and peony",
    description:
      "A tender, elegant bouquet: bergamot and pink pepper opening onto rose, peony and lily of the valley, softened by patchouli and white musk. Graceful and romantic — timeless femininity.",
    gender: "Women",
    season: ["Summer"],
    notes: {
      top: ["Bergamot", "Pink Pepper"],
      heart: ["Rose", "Peony", "Lily of the Valley"],
      base: ["Patchouli", "White Musk"],
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Aqua, Citronellol, Geraniol.",
    sizes: [
      { size: "30ml", price: 710, oldPrice: null, stock: 16 },
      { size: "50ml", price: 1050, oldPrice: 1200, stock: 7 },
      { size: "100ml", price: 1580, oldPrice: null, stock: 6 },
    ],
    rating: 4.7,
    reviewCount: 35,
    bestSeller: false,
    image: "/products/miss-dior.jpg",
    images: ["/products/miss-dior.jpg"],
  },
  {
    id: "rne-08",
    slug: "silver-mountain-water",
    name: "Silver Mountain",
    inspiredBy: "Creed Silver Mountain Water",
    tagline: "Fresh green tea with blackcurrant and musk",
    description:
      "A crisp, luminous scent evoking alpine air: bergamot and mandarin over green tea and blackcurrant, resting on galbanum, sandalwood and musk. Clean, elegant, and refreshing.",
    gender: "Unisex",
    season: ["Summer"],
    notes: {
      top: ["Bergamot", "Mandarin"],
      heart: ["Green Tea", "Blackcurrant"],
      base: ["Galbanum", "Sandalwood", "White Musk"],
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Aqua, Limonene, Linalool.",
    sizes: [
      { size: "30ml", price: 740, oldPrice: null, stock: 12 },
      { size: "50ml", price: 1090, oldPrice: null, stock: 4 },
      { size: "100ml", price: 1640, oldPrice: null, stock: 6 },
    ],
    rating: 4.6,
    reviewCount: 24,
    bestSeller: false,
    image: "/products/silver-mountain-water.jpg",
    images: ["/products/silver-mountain-water.jpg"],
  },
  {
    id: "rne-09",
    slug: "erba-pura",
    name: "Erba Pura",
    inspiredBy: "Xerjoff Erba Pura",
    tagline: "Sweet fruity with citrus and amber",
    description:
      "A joyful, sparkling fragrance: Sicilian orange and bergamot over juicy fruits and jasmine, on a warm amber, musk and vanilla base. Sweet, radiant, and universally loved.",
    gender: "Unisex",
    season: ["Summer", "Winter"],
    notes: {
      top: ["Sicilian Orange", "Bergamot", "Lemon"],
      heart: ["Fruity Notes", "Jasmine"],
      base: ["Amber", "White Musk", "Madagascar Vanilla"],
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Aqua, Limonene, Linalool.",
    sizes: [
      { size: "30ml", price: 760, oldPrice: null, stock: 13 },
      { size: "50ml", price: 1120, oldPrice: 1300, stock: 6 },
      { size: "100ml", price: 1680, oldPrice: null, stock: 6 },
    ],
    rating: 4.8,
    reviewCount: 38,
    bestSeller: true,
    image: "https://drive.google.com/file/d/16G1yUjUcqFKpSpMTz3V0nIoij15EYLeR/view",
    images: ["https://drive.google.com/file/d/16G1yUjUcqFKpSpMTz3V0nIoij15EYLeR/view", "/products/erba-pura.jpg"],
  },
  // ── Added from the RNE Drive folders (2026-09). Names are RNE's own names
  //    from the file titles; prices/stock follow the house tiers and should
  //    be confirmed in Admin → Products.
  {
    id: "rne-10",
    slug: "noxeon",
    name: "Noxéon",
    inspiredBy: "Afnan 9PM",
    tagline: "Warm vanilla amber with apple and cinnamon",
    description:
      "A magnetic evening signature: crisp apple and cinnamon over lavender and orange blossom, settling into a sweet, long-lasting base of vanilla, tonka and amber. Made for nights out.",
    gender: "Men",
    season: ["Winter"],
    families: ["warm"],
    notes: {
      top: ["Apple", "Cinnamon", "Lavender", "Bergamot"],
      heart: ["Orange Blossom", "Lily of the Valley"],
      base: ["Vanilla", "Tonka Bean", "Amber", "Patchouli"],
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Aqua, Coumarin, Linalool.",
    sizes: [
      { size: "30ml", price: 700, oldPrice: null, stock: 10 },
      { size: "50ml", price: 1050, oldPrice: null, stock: 10 },
      { size: "100ml", price: 1580, oldPrice: null, stock: 6 },
    ],
    rating: 5,
    reviewCount: 0,
    bestSeller: false,
    image: "https://drive.google.com/file/d/1ommak5I1x3wRjPO4TFGXMDA3KyntWhpI/view",
    images: ["https://drive.google.com/file/d/1ommak5I1x3wRjPO4TFGXMDA3KyntWhpI/view"],
  },
  {
    id: "rne-11",
    slug: "duskero",
    name: "Duskéro",
    inspiredBy: "Nasomatto Black Afgano",
    tagline: "Dark resinous woods with oud and incense",
    description:
      "Deep, smoky and intense: green resinous notes and incense wrapped around oud, tobacco and dark woods. A bold, long-lasting scent for cold nights.",
    gender: "Unisex",
    season: ["Winter"],
    families: ["woody", "warm"],
    notes: {
      top: ["Green Notes", "Cannabis"],
      heart: ["Resins", "Incense", "Coffee"],
      base: ["Oud", "Tobacco", "Woody Notes"],
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Aqua, Linalool.",
    sizes: [
      { size: "30ml", price: 760, oldPrice: null, stock: 10 },
      { size: "50ml", price: 1120, oldPrice: null, stock: 10 },
      { size: "100ml", price: 1680, oldPrice: null, stock: 6 },
    ],
    rating: 5,
    reviewCount: 0,
    bestSeller: false,
    image: "https://drive.google.com/file/d/1A5z5xnEyHOP9dxUj2erp8zH_pskdG9-b/view",
    images: ["https://drive.google.com/file/d/1A5z5xnEyHOP9dxUj2erp8zH_pskdG9-b/view"],
  },
  {
    id: "rne-12",
    slug: "viremont",
    name: "Viremont",
    inspiredBy: "Burberry Her",
    tagline: "Juicy red berries over soft musk",
    description:
      "Playful and radiant: a burst of strawberry, raspberry and blackberry softened by violet and jasmine, resting on musk, vanilla and amber. Sweet, modern and easy to love.",
    gender: "Women",
    season: ["Summer", "Winter"],
    families: ["floral", "warm"],
    notes: {
      top: ["Strawberry", "Raspberry", "Blackberry", "Mandarin"],
      heart: ["Violet", "Jasmine"],
      base: ["Musk", "Vanilla", "Amber", "Patchouli"],
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Aqua, Limonene, Linalool.",
    sizes: [
      { size: "30ml", price: 720, oldPrice: null, stock: 10 },
      { size: "50ml", price: 1080, oldPrice: null, stock: 10 },
      { size: "100ml", price: 1620, oldPrice: null, stock: 6 },
    ],
    rating: 5,
    reviewCount: 0,
    bestSeller: false,
    image: "https://drive.google.com/file/d/1vGPiZ3idd5BtTngbK6843N_VvPUnZJNo/view",
    images: ["https://drive.google.com/file/d/1vGPiZ3idd5BtTngbK6843N_VvPUnZJNo/view"],
  },
  {
    id: "rne-13",
    slug: "rosaveline",
    name: "Rosavéline",
    inspiredBy: "Parfums de Marly Delina La Rosée",
    tagline: "Fresh dewy rose with lychee and pear",
    description:
      "Light and luminous: juicy lychee and pear open onto a dewy Turkish rose and peony, finished with clean musk. A fresh floral for bright days.",
    gender: "Women",
    season: ["Summer"],
    families: ["floral", "fresh"],
    notes: {
      top: ["Lychee", "Pear", "Bergamot"],
      heart: ["Rose", "Peony"],
      base: ["White Musk", "Vetiver"],
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Aqua, Citronellol, Geraniol.",
    sizes: [
      { size: "30ml", price: 760, oldPrice: null, stock: 10 },
      { size: "50ml", price: 1120, oldPrice: null, stock: 10 },
      { size: "100ml", price: 1680, oldPrice: null, stock: 6 },
    ],
    rating: 5,
    reviewCount: 0,
    bestSeller: false,
    image: "https://drive.google.com/file/d/1Rc7B9SxeE6a6PiYsTuHkTBWTuXpwsOm8/view",
    images: ["https://drive.google.com/file/d/1Rc7B9SxeE6a6PiYsTuHkTBWTuXpwsOm8/view"],
  },
  {
    id: "rne-14",
    slug: "fleur-damour",
    name: "Fleur d'Amour",
    inspiredBy: "Victoria's Secret Bombshell",
    tagline: "Bright fruity floral with peony and passion fruit",
    description:
      "Glamorous and sparkling: passion fruit, grapefruit and pineapple lead into peony and orchid over a soft musky vanilla base. Feminine and full of energy.",
    gender: "Women",
    season: ["Summer"],
    families: ["floral", "fresh"],
    notes: {
      top: ["Passion Fruit", "Grapefruit", "Pineapple", "Strawberry"],
      heart: ["Peony", "Orchid", "Jasmine"],
      base: ["Musk", "Vanilla", "Woody Notes"],
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Aqua, Limonene, Linalool.",
    sizes: [
      { size: "30ml", price: 700, oldPrice: null, stock: 10 },
      { size: "50ml", price: 1050, oldPrice: null, stock: 10 },
      { size: "100ml", price: 1580, oldPrice: null, stock: 6 },
    ],
    rating: 5,
    reviewCount: 0,
    bestSeller: false,
    image: "https://drive.google.com/file/d/15EokeToDNQfvP_IzimIcRdT-sBIkXnud/view",
    images: ["https://drive.google.com/file/d/15EokeToDNQfvP_IzimIcRdT-sBIkXnud/view"],
  },
  {
    id: "rne-discovery",
    slug: "discovery-set",
    name: "Test Package",
    inspiredBy: null,
    // {n} is replaced with testerCount everywhere it is displayed.
    tagline: "Choose {n} testers and find your signature",
    description:
      "Can't decide? Try before you commit. Pick any {n} fragrances from our collection — each as a 5ml tester vial — and discover your perfect scent. One of each, no repeats.",
    gender: "Unisex",
    season: ["Summer", "Winter"],
    notes: { top: [], heart: [], base: [] },
    ingredients: "",
    sizes: [
      { size: "5 × 5ml", price: 350, oldPrice: null, stock: 50 },
    ],
    rating: 4.9,
    reviewCount: 0,
    bestSeller: true,
    isDiscoverySet: true,
    testerCount: 5,       // single source of truth — admin-editable (Admin → Testers)
    maxPerScent: 1,
    image: "/products/test-package.jpg",
    images: ["/products/test-package.jpg"],
  },
];

export const categories = ["Men", "Women", "Summer", "Winter"];

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug);
}

export function getMinPrice(product) {
  // Defensive: a saved override could contain a blank/zero price (e.g. the
  // field was momentarily empty while editing). Ignore non-positive values
  // so the storefront never advertises a product at 0.
  const prices = (product?.sizes || [])
    .map((s) => Number(s?.price))
    .filter((n) => Number.isFinite(n) && n > 0);
  return prices.length ? Math.min(...prices) : 0;
}

export function isInStock(product) {
  return (product?.sizes || []).some((s) => Number(s.stock) > 0);
}

export const DEFAULT_TESTER_COUNT = 5;

/** How many testers the package contains (admin-editable, 2–12). */
export function testerCount(product) {
  const n = Number(product?.testerCount);
  return Number.isInteger(n) && n >= 2 && n <= 12 ? n : DEFAULT_TESTER_COUNT;
}

/** Number formatted for the UI language (Arabic-Indic digits in Arabic). */
export function localNum(n, lang) {
  return lang === "ar" ? Number(n).toLocaleString("ar-EG") : String(n);
}

// Helper: is this image value a real photo URL or local path vs a color placeholder?
export function isPhoto(val) {
  return typeof val === "string" && (/^https?:\/\//.test(val) || val.startsWith("/products/"));
}

// Mock reviews keyed by product id
export const reviews = {};
