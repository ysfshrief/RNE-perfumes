# RNE Perfumes — متجر إلكتروني | E-Commerce Storefront

متجر إلكتروني فاخر لبراند **RNE Perfumes**، مبني بـ Next.js، جاهز للرفع على Vercel.
عربي/إنجليزي كامل مع دعم RTL، وتصميم mobile-first.

A premium, bilingual (Arabic/English, RTL-ready), mobile-first e-commerce
prototype for **RNE Perfumes**, built with Next.js (App Router) and ready to
deploy to Vercel. Front-end only, with mock data.

---

## التشغيل | Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

### Build for production

```bash
npm run build
npm start
```

---

## الرفع على Vercel | Deploy to Vercel

1. ارفع الفولدر على مستودع GitHub.
2. من [vercel.com](https://vercel.com) اختر **Add New Project** واستورد المستودع.
3. Vercel هيتعرّف على Next.js تلقائيًا. اضغط **Deploy**.

---

## 🔑 الدخول لصفحة الإدارة | Admin access

صفحة الإدارة مخفية. للدخول:

1. انزل لأسفل أي صفحة لحد الفوتر.
2. اضغط **٣ مرات** على لوجو **RNE** الموجود في شريط الحقوق بالفوتر.
3. هيظهر صندوق — اكتب **`000`** واضغط دخول.

To open the hidden admin dashboard: tap the **RNE logo** in the footer's
copyright bar **3 times**, then enter **`000`**.

---

## 🌐 اللغة | Language

- العربية هي اللغة الافتراضية (RTL).
- زر تبديل اللغة (عربي/English) موجود في الهيدر.
- كل نصوص الموقع ولوحة الإدارة مترجمة، وأسماء المنتجات ووصفها ونغمات العطر.

---

## 🖼️ اللوجوهات | Logos

الصور الأصلية موجودة في فولدر `public/`:

- `rne-logo.png` — لوجو RNE (نسخة داكنة للخلفيات الفاتحة)
- `rne-logo-light.png` — لوجو RNE (نسخة فاتحة لفوتر داكن)
- `joe-logo.png` — لوجو JOE INDUSTRIES

لتبديل أي لوجو، استبدل الملف في `public/` بنفس الاسم.

---

## المحتوى | What's included

### المتجر | Storefront
الرئيسية، المتجر (بحث + فلاتر)، صفحة المنتج (بهرم نغمات العطر)، السلة (بكوبونات
`RNE10` / `SAVE50`)، الدفع (كل طرق الدفع)، الحساب/تسجيل الدخول/التسجيل، المفضلة،
من نحن، اتصل بنا، الأسئلة الشائعة، وكل السياسات.

### لوحة الإدارة | Admin (`/admin`)
نظرة عامة، المنتجات، الطلبات (بمسار الحالة New → Confirmed → … → Delivered)،
العملاء، التقييمات، الخصومات، المحتوى، والإعدادات.

الفوتر يحتوي على حقوق النشر الإلزامية + لوجو JOE INDUSTRIES.

---

## ملاحظات للإنتاج | Production notes

النسخة دي **front-end فقط ببيانات تجريبية**. قبل الإطلاق الحقيقي محتاج:
Backend + قاعدة بيانات، مصادقة حقيقية، خصم المخزون عند "Confirmed" من السيرفر،
التحقق من الأسعار والمخزون في الـ Backend، وربط بوابة الدفع.

---

جميع الحقوق محفوظة RNE perfumes

Developed & designed by : Youssef Shrief
