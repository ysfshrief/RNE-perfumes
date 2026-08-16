// Mock product catalog for RNE Perfumes.
// Front-end only — in production this comes from the backend / admin dashboard.

export const products = [
  {
    id: "rne-01",
    slug: "noir-absolu",
    name: "Noir Absolu",
    tagline: "Smoke, leather, and midnight amber",
    description:
      "A deep, brooding composition built around smoked oud and black leather, softened by a warm amber drydown. Made for long evenings and colder nights.",
    gender: "Men",
    season: ["Winter"],
    notes: {
      top: ["Bergamot", "Black Pepper"],
      heart: ["Leather", "Cypriol"],
      base: ["Oud", "Amber", "Vanilla"],
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Aqua, Linalool, Coumarin.",
    sizes: [
      { size: "30ml", price: 650, oldPrice: 780, stock: 12 },
      { size: "50ml", price: 950, oldPrice: null, stock: 6 },
    ],
    rating: 4.7,
    reviewCount: 34,
    bestSeller: true,
    images: ["#1a1a1a", "#2b2b2b", "#0f0f0f"],
  },
  {
    id: "rne-02",
    slug: "rose-de-nuit",
    name: "Rose de Nuit",
    tagline: "Damask rose over warm sandalwood",
    description:
      "A modern floral: fresh damask rose lifted with a touch of pink pepper, resting on a creamy sandalwood and musk base. Elegant, never heavy.",
    gender: "Women",
    season: ["Summer", "Winter"],
    notes: {
      top: ["Pink Pepper", "Litchi"],
      heart: ["Damask Rose", "Peony"],
      base: ["Sandalwood", "White Musk"],
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Aqua, Citronellol, Geraniol.",
    sizes: [
      { size: "30ml", price: 700, oldPrice: null, stock: 20 },
      { size: "50ml", price: 1050, oldPrice: 1200, stock: 9 },
    ],
    rating: 4.9,
    reviewCount: 51,
    bestSeller: true,
    images: ["#7a4b52", "#8f5a62", "#6a3d44"],
  },
  {
    id: "rne-03",
    slug: "citrus-marin",
    name: "Citrus Marin",
    tagline: "Sea salt, citrus, and clean cedar",
    description:
      "Bright and airy — Amalfi lemon and sea-salt accord over a clean cedar base. A fresh daytime signature for warm weather.",
    gender: "Men",
    season: ["Summer"],
    notes: {
      top: ["Amalfi Lemon", "Grapefruit"],
      heart: ["Sea Salt", "Rosemary"],
      base: ["Cedar", "Ambergris"],
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Aqua, Limonene, Linalool.",
    sizes: [
      { size: "30ml", price: 600, oldPrice: null, stock: 15 },
      { size: "50ml", price: 880, oldPrice: null, stock: 0 },
    ],
    rating: 4.4,
    reviewCount: 22,
    bestSeller: false,
    images: ["#3d5a6b", "#4a6b7d", "#2f4a58"],
  },
  {
    id: "rne-04",
    slug: "fleur-blanche",
    name: "Fleur Blanche",
    tagline: "Jasmine, tuberose, and soft vanilla",
    description:
      "An opulent white-floral bouquet of jasmine and tuberose, rounded off with a soft vanilla and tonka base. Romantic and long-lasting.",
    gender: "Women",
    season: ["Summer"],
    notes: {
      top: ["Neroli", "Mandarin"],
      heart: ["Jasmine", "Tuberose"],
      base: ["Vanilla", "Tonka Bean"],
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Aqua, Benzyl Salicylate, Linalool.",
    sizes: [
      { size: "30ml", price: 720, oldPrice: 820, stock: 8 },
      { size: "50ml", price: 1100, oldPrice: null, stock: 4 },
    ],
    rating: 4.6,
    reviewCount: 28,
    bestSeller: false,
    images: ["#d8c7b0", "#e5d8c3", "#c9b79c"],
  },
  {
    id: "rne-05",
    slug: "ambre-royal",
    name: "Ambre Royal",
    tagline: "Golden amber, saffron, and resins",
    description:
      "A warm oriental centered on amber and saffron, layered with labdanum and benzoin resins. Rich, enveloping, and unmistakably premium.",
    gender: "Women",
    season: ["Winter"],
    notes: {
      top: ["Saffron", "Cardamom"],
      heart: ["Amber", "Rose"],
      base: ["Labdanum", "Benzoin", "Vanilla"],
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Aqua, Coumarin, Eugenol.",
    sizes: [
      { size: "30ml", price: 780, oldPrice: null, stock: 11 },
      { size: "50ml", price: 1180, oldPrice: 1350, stock: 5 },
    ],
    rating: 4.8,
    reviewCount: 40,
    bestSeller: true,
    images: ["#a9803f", "#bd9350", "#8f6a30"],
  },
  {
    id: "rne-06",
    slug: "vetiver-vert",
    name: "Vetiver Vert",
    tagline: "Green vetiver and crisp bergamot",
    description:
      "An earthy, green vetiver anchored by crisp bergamot and a whisper of vetiver root smoke. Understated and refined for everyday wear.",
    gender: "Men",
    season: ["Summer", "Winter"],
    notes: {
      top: ["Bergamot", "Green Apple"],
      heart: ["Vetiver", "Geranium"],
      base: ["Oakmoss", "Musk"],
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Aqua, Limonene, Citronellol.",
    sizes: [
      { size: "30ml", price: 640, oldPrice: null, stock: 18 },
      { size: "50ml", price: 940, oldPrice: null, stock: 7 },
    ],
    rating: 4.5,
    reviewCount: 19,
    bestSeller: false,
    images: ["#4b5f43", "#5a6f50", "#3c4d36"],
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

// Mock reviews keyed by product id
export const reviews = {
  "rne-01": [
    { name: "Karim H.", rating: 5, date: "2026-07-12", text: "Lasts all day, projects beautifully. My signature scent now." },
    { name: "Omar S.", rating: 4, date: "2026-06-30", text: "Great for winter nights. Slightly strong at first spray." },
  ],
  "rne-02": [
    { name: "Nada M.", rating: 5, date: "2026-08-01", text: "The rose is so natural, not soapy at all. Obsessed." },
    { name: "Sara A.", rating: 5, date: "2026-07-20", text: "Compliments every time I wear it." },
  ],
  "rne-05": [
    { name: "Dina F.", rating: 5, date: "2026-07-05", text: "Warm and luxurious. Worth every pound." },
  ],
};
