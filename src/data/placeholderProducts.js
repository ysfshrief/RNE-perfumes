// ─────────────────────────────────────────────────────────────
// OPT-IN DEMO CATALOGUE
//
// These are fictional placeholder fragrances used to evaluate the redesign
// (grid, filters, search, collections, detail pages) without touching the
// client's 9 real products.
//
// They are NOT loaded automatically. The admin loads or clears them from
// Admin → Products, and they are stored through the SAME custom-product
// mechanism as any admin-created product (ProductContext `__custom__`),
// so they behave exactly like database products and are fully replaceable.
//
// `image` accepts the same values as every other product: a Google Drive
// share link, any https URL, or a local path — all normalised by
// normalizeImageUrl(). Replace the value in the admin to swap the media;
// no UI source changes required.
// ─────────────────────────────────────────────────────────────

export const PLACEHOLDER_PREFIX = "demo_";

const p = (
  name, priceMid, gender, season, tagline, description, top, heart, base, bestSeller = false, image = ""
) => ({
  name,
  gender,
  season,
  tagline,
  description,
  notes: { top, heart, base },
  ingredients: "Alcohol Denat., Parfum (Fragrance), Aqua, Linalool.",
  sizes: [
    { size: "30ml", price: Math.round((priceMid * 0.68) / 10) * 10, oldPrice: null, stock: 12 },
    { size: "50ml", price: priceMid, oldPrice: null, stock: 9 },
    { size: "100ml", price: Math.round((priceMid * 1.5) / 10) * 10, oldPrice: null, stock: 5 },
  ],
  bestSeller,
  image,
});

export const placeholderProducts = [
  p("Rêve Noir", 980, "Unisex", ["Winter"],
    "Dark plum, incense and smoked woods",
    "An opulent night fragrance: dark plum softened by violet, drifting into olibanum and smoked cedar. Built for long winter evenings.",
    ["Plum", "Pink Pepper"], ["Violet", "Olibanum"], ["Cedar", "Amber"], true),

  p("Éclat", 760, "Women", ["Summer"],
    "Bright neroli over soft musk",
    "A luminous everyday floral. Neroli and mandarin open clean and bright, settling into white musk and a whisper of iris.",
    ["Mandarin", "Neroli"], ["Iris", "Peony"], ["White Musk"]),

  p("Nocturne", 1120, "Men", ["Winter"],
    "Leather, saffron and tobacco",
    "A confident evening signature. Saffron and black pepper lead into supple leather, resting on tobacco and tonka.",
    ["Saffron", "Black Pepper"], ["Leather", "Rose"], ["Tobacco", "Tonka Bean"], true),

  p("Santal 09", 1040, "Unisex", ["Winter"],
    "Creamy sandalwood and cardamom",
    "Sandalwood at the centre, warmed by cardamom and a trace of milky vanilla. Quiet, close to the skin, unmistakably refined.",
    ["Cardamom", "Bergamot"], ["Sandalwood", "Guaiac Wood"], ["Vanilla", "Musk"]),

  p("Azure Mist", 690, "Unisex", ["Summer"],
    "Marine freshness with citrus lift",
    "Sea air rendered as fragrance: aquatic notes, grapefruit and mint over a clean cedar base. Effortless for hot days.",
    ["Grapefruit", "Mint"], ["Aqua Notes", "Sea Salt"], ["Cedar", "Musk"]),

  p("Velvet Oud", 1480, "Unisex", ["Winter"],
    "Rich oud with rose and amber",
    "A generous oriental. Oud and Damask rose intertwine over amber and patchouli — deep, resinous and long-lasting.",
    ["Saffron", "Rose"], ["Oud", "Patchouli"], ["Amber", "Musk"], true),

  p("Fleur Blanche", 820, "Women", ["Summer"],
    "White florals, airy and clean",
    "Jasmine and tuberose kept deliberately light, lifted by pear and finished with soft cashmere woods.",
    ["Pear", "Bergamot"], ["Jasmine", "Tuberose"], ["Cashmere Wood", "Musk"]),

  p("Amber Night", 1180, "Unisex", ["Winter"],
    "Warm amber, vanilla and benzoin",
    "An enveloping amber built on benzoin and vanilla, with a dry spice opening that keeps it from turning too sweet.",
    ["Nutmeg", "Bergamot"], ["Amber", "Benzoin"], ["Vanilla", "Labdanum"]),

  p("Citrus Veil", 640, "Unisex", ["Summer"],
    "Lemon, petitgrain and green tea",
    "A crisp citrus cologne. Lemon and petitgrain over green tea and vetiver — sharp at first, calm as it settles.",
    ["Lemon", "Petitgrain"], ["Green Tea", "Neroli"], ["Vetiver", "Musk"]),

  p("Bois Intense", 1260, "Men", ["Winter"],
    "Dry woods with smoky vetiver",
    "Vetiver and guaiac wood dominate, dried out with black pepper and grounded in ambergris. Sober and architectural.",
    ["Black Pepper", "Elemi"], ["Vetiver", "Guaiac Wood"], ["Ambergris", "Cedar"]),

  p("Rose Élégante", 940, "Women", ["Winter"],
    "Damask rose with lychee and musk",
    "A modern rose: lychee and raspberry keep the opening bright before Damask rose deepens over patchouli and musk.",
    ["Lychee", "Raspberry"], ["Damask Rose", "Peony"], ["Patchouli", "White Musk"], true),

  p("Midnight Iris", 1080, "Unisex", ["Winter"],
    "Powdery iris over warm woods",
    "Iris root at its most elegant — powdery and cool — set against sandalwood and a soft amber drydown.",
    ["Bergamot", "Carrot Seed"], ["Iris", "Violet"], ["Sandalwood", "Amber"]),

  p("Ocean Élan", 720, "Men", ["Summer"],
    "Salty freshness with driftwood",
    "Bright and breezy: sea salt and bergamot over sage, drying down to driftwood and clean musk.",
    ["Bergamot", "Sea Salt"], ["Sage", "Aqua Notes"], ["Driftwood", "Musk"]),

  p("Golden Resin", 1340, "Unisex", ["Winter"],
    "Frankincense, myrrh and honey",
    "A resinous, almost ceremonial composition. Frankincense and myrrh laced with honey, settling on labdanum and amber.",
    ["Elemi", "Honey"], ["Frankincense", "Myrrh"], ["Labdanum", "Amber"]),

  p("Pure Aura", 880, "Unisex", ["Summer"],
    "Clean musk and soft cotton",
    "Deliberately minimal — cotton-clean musks with a trace of bergamot and cashmere wood. A second-skin scent.",
    ["Bergamot", "Aldehydes"], ["Cotton Accord", "Iris"], ["White Musk", "Cashmere Wood"]),
];

export const PLACEHOLDER_COUNT = placeholderProducts.length;
