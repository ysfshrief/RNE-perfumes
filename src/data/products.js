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
    image: "#3a2a1a",
    images: ["#3a2a1a", "#4a3520", "#2a1e12"],
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
    image: "#7a2a3a",
    images: ["#7a2a3a", "#8f3548", "#661f30"],
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
    image: "#2a6a7a",
    images: ["#2a6a7a", "#358090", "#1f5460"],
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
    image: "#5a8a8f",
    images: ["#5a8a8f", "#6fa0a5", "#456d72"],
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
    image: "#1a2a4a",
    images: ["#1a2a4a", "#243560", "#131f38"],
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
    image: "#14203a",
    images: ["#14203a", "#1e2c4e", "#0e1728"],
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
    image: "#c98a9a",
    images: ["#c98a9a", "#d89caa", "#b8788a"],
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
    image: "#8a9a9f",
    images: ["#8a9a9f", "#a0b0b5", "#6d7d82"],
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
    image: "#1a9a9a",
    images: ["#1a9a9a", "#20b0b0", "#147a7a"],
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

// Helper: is this image value a real photo URL vs a color placeholder?
export function isPhoto(val) {
  return typeof val === "string" && /^https?:\/\//.test(val);
}

// Mock reviews keyed by product id
export const reviews = {
  "rne-01": [
    { name: "Karim H.", rating: 5, date: "2026-07-12", text: "The sweetness and spice are perfect for winter. Lasts all day." },
    { name: "Omar S.", rating: 5, date: "2026-06-30", text: "Smells expensive. Everyone asks what I'm wearing." },
  ],
  "rne-05": [
    { name: "Ziad M.", rating: 5, date: "2026-08-01", text: "My everyday scent. Fresh, clean, never fails." },
  ],
  "rne-06": [
    { name: "Youssef A.", rating: 5, date: "2026-07-20", text: "Beast mode performance. Exactly like the original." },
    { name: "Mostafa K.", rating: 4, date: "2026-07-05", text: "Great projection. Wish the 50ml was always in stock." },
  ],
  "rne-02": [
    { name: "Nada F.", rating: 5, date: "2026-08-03", text: "Sweet but classy. Compliments non-stop." },
  ],
};
