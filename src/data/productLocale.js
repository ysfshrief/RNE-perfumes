// Arabic localized content for products, keyed by product id.
// Notes are translated via the noteMap below.

export const productAr = {
  "rne-01": {
    name: "نوّار أبسولو",
    tagline: "دخان وجلد وعنبر منتصف الليل",
    description:
      "تركيبة عميقة وغامضة مبنية حول العود المدخّن والجلد الأسود، تلطّفها قاعدة عنبر دافئة. صُنعت للأمسيات الطويلة والليالي الباردة.",
    ingredients: "كحول، عطر، ماء، لينالول، كومارين.",
  },
  "rne-02": {
    name: "روز دو نوي",
    tagline: "وردة دمشقية على خشب الصندل الدافئ",
    description:
      "عطر زهري عصري: وردة دمشقية منعشة مع لمسة فلفل وردي، ترتكز على قاعدة كريمية من خشب الصندل والمسك. أنيق دون ثقل.",
    ingredients: "كحول، عطر، ماء، سيترونيلول، جيرانيول.",
  },
  "rne-03": {
    name: "سيتروس مارين",
    tagline: "ملح البحر والحمضيات والأرز النظيف",
    description:
      "منعش وخفيف — ليمون أمالفي ونغمة ملح البحر على قاعدة أرز نظيفة. توقيع نهاري منعش للطقس الدافئ.",
    ingredients: "كحول، عطر، ماء، ليمونين، لينالول.",
  },
  "rne-04": {
    name: "فلور بلانش",
    tagline: "ياسمين ومسك الروم وفانيليا ناعمة",
    description:
      "باقة زهرية بيضاء فاخرة من الياسمين ومسك الروم، تُختتم بقاعدة ناعمة من الفانيليا والتونكا. رومانسي وطويل الثبات.",
    ingredients: "كحول، عطر، ماء، بنزيل ساليسيلات، لينالول.",
  },
  "rne-05": {
    name: "عنبر رويال",
    tagline: "عنبر ذهبي وزعفران وراتنجات",
    description:
      "عطر شرقي دافئ يتمحور حول العنبر والزعفران، بطبقات من راتنجات اللبدانم والبنزوين. غني وغامر وفاخر بلا منازع.",
    ingredients: "كحول، عطر، ماء، كومارين، أوجينول.",
  },
  "rne-06": {
    name: "فيتيفر فير",
    tagline: "فيتيفر أخضر وبرغموت منعش",
    description:
      "فيتيفر ترابي أخضر يرتكز على برغموت منعش مع لمسة من دخان جذور الفيتيفر. راقٍ وهادئ للارتداء اليومي.",
    ingredients: "كحول، عطر، ماء، ليمونين، سيترونيلول.",
  },
};

// Fragrance-note name translations
export const noteMap = {
  "Bergamot": "برغموت",
  "Black Pepper": "فلفل أسود",
  "Leather": "جلد",
  "Cypriol": "سيبريول",
  "Oud": "عود",
  "Amber": "عنبر",
  "Vanilla": "فانيليا",
  "Pink Pepper": "فلفل وردي",
  "Litchi": "ليتشي",
  "Damask Rose": "وردة دمشقية",
  "Peony": "بيوني",
  "Sandalwood": "خشب الصندل",
  "White Musk": "مسك أبيض",
  "Amalfi Lemon": "ليمون أمالفي",
  "Grapefruit": "جريب فروت",
  "Sea Salt": "ملح البحر",
  "Rosemary": "إكليل الجبل",
  "Cedar": "أرز",
  "Ambergris": "عنبر رمادي",
  "Neroli": "نيرولي",
  "Mandarin": "يوسفي",
  "Jasmine": "ياسمين",
  "Tuberose": "مسك الروم",
  "Tonka Bean": "حبة التونكا",
  "Saffron": "زعفران",
  "Cardamom": "هيل",
  "Rose": "وردة",
  "Labdanum": "لبدانم",
  "Benzoin": "بنزوين",
  "Green Apple": "تفاح أخضر",
  "Vetiver": "فيتيفر",
  "Geranium": "جيرانيوم",
  "Oakmoss": "طحلب البلوط",
  "Musk": "مسك",
};

// Helpers: return the right field for the current language
export function pName(product, lang) {
  return lang === "ar" ? productAr[product.id]?.name || product.name : product.name;
}
export function pTagline(product, lang) {
  return lang === "ar" ? productAr[product.id]?.tagline || product.tagline : product.tagline;
}
export function pDescription(product, lang) {
  return lang === "ar" ? productAr[product.id]?.description || product.description : product.description;
}
export function pIngredients(product, lang) {
  return lang === "ar" ? productAr[product.id]?.ingredients || product.ingredients : product.ingredients;
}
export function tNote(note, lang) {
  return lang === "ar" ? noteMap[note] || note : note;
}
