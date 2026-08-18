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
    ],
    rating: 4.7,
    reviewCount: 39,
    bestSeller: true,
    image: "/products/scandal.jpg",
    images: ["/products/scandal.jpg"],
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
    ],
    rating: 4.9,
    reviewCount: 63,
    bestSeller: true,
    image: "/products/bleu-de-chanel.jpg",
    images: ["/products/bleu-de-chanel.jpg"],
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
    ],
    rating: 4.8,
    reviewCount: 38,
    bestSeller: true,
    image: "/products/erba-pura.jpg",
    images: ["/products/erba-pura.jpg"],
  },
];

export const categories = ["Men", "Women", "Summer", "Winter"];

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug);
}

export function getMinPrice(product) {
  return Math.min(...product.sizes.map((s) => s.price));
}

export function isInStock(product) {
  return product.sizes.some((s) => s.stock > 0);
}

// Helper: is this image value a real photo URL or local path vs a color placeholder?
export function isPhoto(val) {
  return typeof val === "string" && (/^https?:\/\//.test(val) || val.startsWith("/products/"));
}

// Mock reviews keyed by product id
export const reviews = {};
