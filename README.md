# RNE Perfumes — متجر إلكتروني | E-Commerce Storefront

متجر إلكتروني فاخر لبراند **RNE Perfumes**، مبني بـ Next.js، جاهز للرفع على Vercel.
عربي/إنجليزي كامل مع دعم RTL، وتصميم mobile-first، ولوحة تحكم كاملة للأدمن.

A premium, bilingual (Arabic/English, RTL) e-commerce storefront for **RNE
Perfumes**, built with Next.js (App Router). Front-end prototype with mock data
and a full admin dashboard. Ready to deploy to Vercel.

---

## التشغيل | Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

### Production build

```bash
npm run build && npm start
```

---

## 🔑 الدخول للوحة الإدارة | Admin access

لوحة الإدارة مخفية. للدخول:

1. انزل لأسفل أي صفحة لحد الفوتر.
2. اضغط **٣ مرات** على لوجو **RNE** الموجود في شريط الحقوق بالفوتر.
3. اكتب الكود **`000`** واضغط دخول.

To open the hidden admin dashboard: tap the **RNE logo** in the footer's
copyright bar **3 times**, then enter **`000`**.

---

## 🛠️ لوحة الإدارة | Admin dashboard

### تعديل كل نص في الموقع | Edit every text (Content page)
صفحة **«المحتوى» / "Content"** بتخليك تعدّل **أي كلمة** في الموقع (الهيدر، الهيرو،
الفوتر، صفحات المنتج، السلة، الدفع… كل حاجة) — بالعربي والإنجليزي، مع بحث وأقسام.
التغييرات تُحفظ فورًا وتظهر في الموقع مباشرة.

Edit **any** text on the entire site in both languages, organized by section
with search. Changes save instantly and reflect on the storefront live.

### إدارة المنتجات | Products
صفحة **«المنتجات»** فيها شبكة بطاقات لكل منتج. اضغط على أي منتج لفتح شاشة التعديل:
- **الصور عبر روابط Google Drive** — شارِك ملف الصورة كـ«أي شخص لديه الرابط»،
  والصق الرابط. يتحوّل تلقائيًا لصورة تظهر في المتجر. (أو استخدم لون مثل `#1a1a1a`
  كصورة مؤقتة.)
- الاسم، «مستوحى من»، التصنيف.
- المقاسات والأسعار وقبل الخصم والمخزون.
- إظهار/إخفاء من المتجر، والأكثر مبيعًا.

**Product images use Google Drive links** — share the file as "Anyone with the
link" and paste it; it converts to an inline image automatically. Edit names,
prices, stock, visibility, and more. The Arabic name/description are edited from
the Content page.

### باقي الأقسام | Other sections
الطلبات (بمسار الحالة)، العملاء، التقييمات، الخصومات، الإعدادات.

---

## 🎡 المميزات | Features

- **سلايدر إعلانات** (زي نون) — قابل للتقليب باللمس، autoplay، أسهم ونقاط.
- **عجلة حظ** — الجوائز والاحتمالات تُضبط من إعدادات الموقع، بتطلع كود خصم.
- **زر «تواصل معانا للتفاصيل»** في صفحة المنتج — يفتح واتساب مباشرة.
- **زر واتساب طائف** على كل الصفحات.
- **تبديل اللغة** ظاهر في الهيدر (عربي/إنجليزي) مع RTL كامل.

---

## 🌐 اللغة | Language
العربية افتراضية (RTL). زر التبديل في الهيدر. كل النصوص قابلة للترجمة والتعديل.

## 🖼️ اللوجوهات | Logos
في فولدر `public/`: `rne-logo.png` (داكن)، `rne-logo-light.png` (فاتح للفوتر)،
`joe-logo.png` (JOE INDUSTRIES). لتبديل أي لوجو استبدل الملف بنفس الاسم.

---

## الرفع على Vercel | Deploy

1. ارفع الفولدر على مستودع GitHub.
2. من [vercel.com](https://vercel.com) اختر **Add New Project** واستورد المستودع.
3. Vercel هيتعرّف على Next.js تلقائيًا — اضغط **Deploy**.

---

## ملاحظات للإنتاج | Production notes

النسخة دي **front-end ببيانات تجريبية**. تعديلات الأدمن تُحفظ حاليًا في متصفح
الأدمن (localStorage). قبل الإطلاق الحقيقي محتاج backend + قاعدة بيانات لحفظ
التعديلات على السيرفر وعرضها لكل الزوار، مصادقة حقيقية، وربط بوابة الدفع.

This is a **front-end prototype**. Admin edits persist in the admin's browser
(localStorage). For production you'll need a backend + database so edits save
server-side for all visitors, real authentication, and a payment gateway.

---

جميع الحقوق محفوظة RNE perfumes

Developed & designed by : Youssef Shrief
