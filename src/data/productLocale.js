import { testerCount, localNum } from "./products";

// Arabic localized content for products, keyed by product id.

export const productAr = {
  "rne-01": {
    name: "خمرة",
    tagline: "عنبر حلو بالتوابل مع التمر والفانيليا",
    description:
      "عطر شرقي دافئ يتمحور حول التمر المسكّر والقرفة والبرالين، يرتكز على قاعدة غنية من العنبر والتونكا والفانيليا. دافئ وحلو وفاخر — توقيع مثالي للأمسيات الباردة.",
    ingredients: "كحول، عطر، ماء، كومارين، لينالول.",
  },
  "rne-02": {
    name: "سكاندال",
    tagline: "زهري بالعسل مع الكراميل والجاردينيا",
    description:
      "عطر زهري جريء وحلو يتمحور حول العسل والبرتقال الدموي، يتفتح إلى جاردينيا وياسمين، ويُختتم بالكراميل والباتشولي. أنثوي وجذّاب وصُنع ليلفت الأنظار.",
    ingredients: "كحول، عطر، ماء، بنزيل ساليسيلات، سيترونيلول.",
  },
  "rne-03": {
    name: "باسيفيك تشيل",
    tagline: "حمضيات منعشة مع النعناع والكشمش",
    description:
      "حمضيات منعشة وحيوية: ليمون ويوسفي يرتفعان بالنعناع والكشمش الأسود، على قاعدة مسكية نظيفة. منعش ومثالي لنهار الصيف.",
    ingredients: "كحول، عطر، ماء، ليمونين، لينالول.",
  },
  "rne-04": {
    name: "إيماجينيشن",
    tagline: "شاي بالحمضيات مع الزنجبيل والأخشاب الدافئة",
    description:
      "تركيبة أنيقة وخفيفة: برغموت وبرتقال على شاي أسود وزنجبيل، ترتكز على الأمبروكسان وخشب الغاياك. راقٍ ومتعدد الاستخدامات — أناقة نظيفة لأي مناسبة.",
    ingredients: "كحول، عطر، ماء، ليمونين، لينالول.",
  },
  "rne-05": {
    name: "بلو",
    tagline: "خشبي عطري مع الحمضيات والبخور",
    description:
      "توقيع رجالي خالد: جريب فروت وبرغموت منعش على نعناع وفلفل وردي، يرتكز على الأرز والبخور وخشب الصندل. واثق ونظيف وسهل الارتداء في كل وقت.",
    ingredients: "كحول، عطر، ماء، ليمونين، كومارين.",
  },
  "rne-06": {
    name: "سوفاج",
    tagline: "منعش حار مع الفلفل والأمبروكسان",
    description:
      "عطر فوجير قوي ومشعّ: برغموت لامع على فلفل سيشوان وخزامى، مدفوع بقاعدة الأمبروكسان والأرز المميّزة. جريء وجذّاب — عطر قوة يومي.",
    ingredients: "كحول، عطر، ماء، ليمونين، كومارين.",
  },
  "rne-07": {
    name: "مِس",
    tagline: "زهري رومانسي مع الورد والبيوني",
    description:
      "باقة أنيقة ورقيقة: برغموت وفلفل وردي يتفتحان على الورد والبيوني وزنبق الوادي، يلطّفهما الباتشولي والمسك الأبيض. أنوثة خالدة ورومانسية.",
    ingredients: "كحول، عطر، ماء، سيترونيلول، جيرانيول.",
  },
  "rne-08": {
    name: "سيلفر ماونتن",
    tagline: "شاي أخضر منعش مع الكشمش والمسك",
    description:
      "عطر منعش ومشرق يستحضر هواء الجبال: برغموت ويوسفي على شاي أخضر وكشمش أسود، يرتكز على الجلبانوم وخشب الصندل والمسك. نظيف وأنيق ومنعش.",
    ingredients: "كحول، عطر، ماء، ليمونين، لينالول.",
  },
  "rne-discovery": {
    name: "تيست باكيدچ",
    tagline: "اختار {n} تيسترات واكتشف عطرك المفضّل",
    description:
      "مش متأكد؟ جرّب قبل ما تشتري. اختار أي {n} عطور من مجموعتنا — كل واحد كتيستر ٥ مل — واكتشف ريحتك المفضّلة. نوع واحد من كل عطر، بدون تكرار.",
    ingredients: "",
  },
  "rne-09": {
    name: "إربا بورا",
    tagline: "فواكه حلوة مع الحمضيات والعنبر",
    description:
      "عطر مبهج ومتلألئ: برتقال صقلي وبرغموت على فواكه غنية وياسمين، على قاعدة دافئة من العنبر والمسك والفانيليا. حلو ومشعّ ومحبوب للجميع.",
    ingredients: "كحول، عطر، ماء، ليمونين، لينالول.",
  },
};

export const noteMap = {
  "Bergamot": "برغموت", "Black Pepper": "فلفل أسود", "Leather": "جلد",
  "Cypriol": "سيبريول", "Oud": "عود", "Amber": "عنبر", "Vanilla": "فانيليا",
  "Pink Pepper": "فلفل وردي", "Litchi": "ليتشي", "Damask Rose": "وردة دمشقية",
  "Peony": "بيوني", "Sandalwood": "خشب الصندل", "White Musk": "مسك أبيض",
  "Amalfi Lemon": "ليمون أمالفي", "Grapefruit": "جريب فروت", "Sea Salt": "ملح البحر",
  "Rosemary": "إكليل الجبل", "Cedar": "أرز", "Ambergris": "عنبر رمادي",
  "Neroli": "نيرولي", "Mandarin": "يوسفي", "Jasmine": "ياسمين",
  "Tuberose": "مسك الروم", "Tonka Bean": "حبة التونكا", "Saffron": "زعفران",
  "Cardamom": "هيل", "Rose": "وردة", "Labdanum": "لبدانم", "Benzoin": "بنزوين",
  "Green Apple": "تفاح أخضر", "Vetiver": "فيتيفر", "Geranium": "جيرانيوم",
  "Oakmoss": "طحلب البلوط", "Musk": "مسك", "Cinnamon": "قرفة", "Nutmeg": "جوزة الطيب",
  "Dates": "تمر", "Praline": "برالين", "Blood Orange": "برتقال دموي",
  "Gardenia": "جاردينيا", "Honey": "عسل", "Caramel": "كراميل", "Patchouli": "باتشولي",
  "Lemon": "ليمون", "Mint": "نعناع", "Blackcurrant": "كشمش أسود",
  "Coriander Seed": "بذور الكزبرة", "Orange": "برتقال", "Black Tea": "شاي أسود",
  "Ginger": "زنجبيل", "Ceylon Cinnamon": "قرفة سيلانية", "Ambroxan": "أمبروكسان",
  "Guaiac Wood": "خشب الغاياك", "Olibanum": "لبان", "Incense": "بخور",
  "Sichuan Pepper": "فلفل سيشوان", "Lavender": "خزامى", "Star Anise": "يانسون نجمي",
  "Lily of the Valley": "زنبق الوادي", "Green Tea": "شاي أخضر", "Galbanum": "جلبانوم",
  "Sicilian Orange": "برتقال صقلي", "Fruity Notes": "نغمات فواكه",
  "Madagascar Vanilla": "فانيليا مدغشقر", "Coumarin": "كومارين",
};

const genderMap = { Men: "رجالي", Women: "حريمي", Unisex: "للجنسين" };
const seasonMap = { Summer: "صيفي", Winter: "شتوي" };

// Localised product text. Order of precedence:
//   1. admin-entered field on the product (nameAr / taglineAr / …)
//   2. the built-in Arabic catalogue above
//   3. the English value
// "{n}" is filled with the tester count so the Test Package copy always
// matches the configured number of testers.
function fill(str, product, lang) {
  if (typeof str !== "string" || !str.includes("{n}")) return str;
  return str.split("{n}").join(localNum(testerCount(product), lang));
}
function localized(product, field, lang) {
  if (!product) return "";
  if (lang === "ar") {
    const own = product[`${field}Ar`];
    const v = (typeof own === "string" && own.trim()) ? own : productAr[product.id]?.[field] || product[field];
    return fill(v, product, lang);
  }
  return fill(product[field], product, lang);
}

export function pName(product, lang) {
  return localized(product, "name", lang);
}
export function pTagline(product, lang) {
  return localized(product, "tagline", lang);
}
export function pDescription(product, lang) {
  return localized(product, "description", lang);
}
export function pIngredients(product, lang) {
  return localized(product, "ingredients", lang);
}
export function tNote(note, lang) {
  return lang === "ar" ? noteMap[note] || note : note;
}
export function tGender(g, lang) {
  return lang === "ar" ? genderMap[g] || g : g;
}
export function tSeason(s, lang) {
  return lang === "ar" ? seasonMap[s] || s : s;
}
