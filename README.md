# RNE Perfumes — متجر إلكتروني | E-Commerce Storefront

متجر إلكتروني فاخر لبراند **RNE Perfumes**، مبني بـ Next.js، جاهز للرفع على Vercel.
عربي/إنجليزي كامل مع دعم RTL، وتصميم mobile-first، ولوحة تحكم كاملة للأدمن.

A premium, bilingual (Arabic/English, RTL) e-commerce storefront for **RNE
Perfumes**, built with Next.js (App Router). Front-end prototype with mock data
and a full admin dashboard. Ready to deploy to Vercel.

> 🔥 **الربط بـ Firebase + بيئات Vercel:** اتبع دليل **`SETUP.md`** — المشروع
> جاهز ومتوصّل، وبمجرد إضافة مفاتيح Firebase كل التعديلات هتتحفظ على السيرفر
> وتظهر لكل الزوار. من غير مفاتيح، الموقع يشتغل عادي بتخزين محلي.
> See **`SETUP.md`** for the full Firebase + Vercel guide.

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

- **مع Firebase (الإنتاج):** لوحة `/admin` تتطلب تسجيل الدخول بحساب عليه صلاحية
  `admin` (تُضاف بـ `node scripts/setAdmin.mjs email@example.com`). قواعد Firestore
  تمنع أي تعديل من غير الأدمن.
- **بدون Firebase (وضع تجريبي):** اضغط ٣ مرات على لوجو RNE في الفوتر واكتب الكود
  (`NEXT_PUBLIC_ADMIN_DEMO_CODE`، الافتراضي `000`). التعديلات تُحفظ في المتصفح فقط.

> ⚠️ **لا ترفع أبدًا ملف مفتاح الخدمة (serviceAccountKey.json)** — الملف مضاف في `.gitignore`.

With Firebase configured, `/admin` requires a signed-in user with the `admin`
custom claim. Without Firebase (demo mode) a session code gate is used.

---

## 🛠️ لوحة الإدارة | Admin dashboard

| الصفحة | ماذا تدير |
|--------|-----------|
| نظرة عامة | الإحصائيات، صحة الكتالوج، اختصارات |
| المنتجات | الصور (أكثر من صورة لكل عطر)، الأسعار والمقاسات والمخزون، الجنس، الموسم، المجموعة (زهور/أخشاب/منعش/دافئ)، النصوص عربي/إنجليزي، النوتات، الإظهار |
| التيسترات | عدد التيسترات (الافتراضي ٥)، السعر، المخزون، الصور، العطور المتاحة |
| الطلبات | حالة الطلب، إرجاع المخزون تلقائيًا عند الإلغاء/الإرجاع، التيسترات المختارة |
| الصفحة الرئيسية | صور الهيرو وترتيبها ونصوصها وزرها، شرائح البانر المتحرك، صور خانات التصنيفات |
| الخصومات | كوبونات بنسبة أو قيمة ثابتة مع شروط |
| المحتوى | أي نص في الموقع بالعربي والإنجليزي |
| الإعدادات | الألوان، التأثيرات، طرق الدفع، بيانات التواصل والسوشيال، الخصائص (عجلة الحظ) |

**الصور:** كل حقول الصور تقبل روابط Google Drive (مشاركة «أي شخص لديه الرابط») أو أي رابط مباشر.

**عجلة الحظ** موقوفة حاليًا — تُفعَّل من الإعدادات ← الخصائص.

---

## 🎡 المميزات | Features

- **سلايدر إعلانات** (زي نون) — قابل للتقليب باللمس، autoplay، أسهم ونقاط.
- **عجلة حظ** — موقوفة مؤقتًا (تُفعَّل من الإعدادات ← الخصائص).
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
