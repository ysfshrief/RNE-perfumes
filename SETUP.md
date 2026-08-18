# دليل الإعداد الكامل | Firebase + Vercel Setup Guide

المشروع **جاهز ومتوصّل بـ Firebase**. لو رفعته من غير مفاتيح Firebase، هيشتغل عادي
بتخزين محلي (localStorage). أول ما تضيف المفاتيح، كل التعديلات (المنتجات، النصوص،
السلايدر، العجلة) هتتحفظ في **Firestore** وتظهر لكل الزوار.

The app is **already wired to Firebase**. Without keys it runs on localStorage;
add the keys and everything persists to Firestore for all visitors — no code
changes required.

---

## الجزء الأول: Firebase

### 1) إنشاء المشروع
1. [console.firebase.google.com](https://console.firebase.google.com) → **Add project**.
2. اسم المشروع: `rne-perfumes` → Continue → Create project.

### 2) تسجيل تطبيق ويب
1. اضغط أيقونة الويب **`</>`** → nickname: `rne-web` → Register app.
2. انسخ قيم `firebaseConfig` — هتحطها في Vercel و `.env.local`.

### 3) تفعيل الخدمات
- **Firestore Database** → Create database → **Production mode** → region `eur3` (أوروبا، الأقرب لمصر).
- **Authentication** → Get started → فعّل **Email/Password**.
- **Storage** (اختياري لو هترفع صور على Firebase بدل درايف) → Get started.

### 4) رفع قواعد الأمان (Security Rules)
افتح **Firestore → Rules**، الصق محتوى ملف `firestore.rules` الموجود في المشروع،
واضغط **Publish**. (أو عبر الـ CLI: `firebase deploy --only firestore:rules`)

### 5) تعيين الأدمن
1. حمّل مفتاح الخدمة: **Project settings → Service accounts → Generate new private key**
   → احفظه باسم `serviceAccountKey.json` في جذر المشروع (الملف ده **متترفعش** على GitHub).
2. المستخدم لازم يسجّل في الموقع مرة الأول (Email/Password).
3. شغّل:
   ```bash
   node scripts/setAdmin.mjs your-admin@email.com
   ```
4. الأدمن يسجّل خروج ودخول تاني عشان الصلاحية تتفعّل.

### 6) (اختياري) نقل البيانات الافتراضية لـ Firestore
```bash
node scripts/seed.mjs
```
ده بيملأ `settings/config` بإعدادات السلايدر والعجلة. مش ضروري — التطبيق بيستخدم
القيم الافتراضية لأي حاجة ناقصة.

---

## الجزء الثاني: Vercel

### 1) النشر
1. ارفع المشروع على **GitHub**.
2. [vercel.com](https://vercel.com) → **Add New → Project** → استورد الريبو → **Deploy**.
   (Vercel هيقرأ `vercel.json` ويتعرّف على Next.js تلقائيًا.)

### 2) البيئات الثلاثة
| البيئة | متى | الاستخدام |
|--------|-----|-----------|
| **Production** | push على `main` | الموقع الرسمي |
| **Preview** | أي branch/PR تاني | تجربة قبل النشر |
| **Development** | `vercel dev` محليًا | التطوير |

### 3) متغيرات البيئة
**Project → Settings → Environment Variables**، أضف الآتي واختر **الثلاث بيئات**
لكل واحد:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MSG_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```
القيم من `firebaseConfig` اللي نسخته. بعد الإضافة → **Redeploy**.

> **الأمان:** `NEXT_PUBLIC_*` بتظهر في المتصفح، وده عادي لمفاتيح Firebase العميل —
> الحماية الحقيقية في `firestore.rules`. أي مفتاح **سري** (بوابة الدفع مثلًا)
> حطّه **من غير** بادئة `NEXT_PUBLIC_`.

### 4) الأفضل: مشروعين Firebase
اعمل مشروع Firebase للـ **Production** وواحد للـ **Preview**، وحط مفاتيح كل واحد
في البيئة المناسبة عشان التجارب ما تلمسش بيانات الموقع الرسمي.

---

## التطوير المحلي | Local development

```bash
cp .env.example .env.local      # واملأه بمفاتيح Firebase
npm install
npm run dev
```

---

## كيف يشتغل الربط | How the wiring works

| المكان | البيانات | مستند Firestore |
|--------|----------|-----------------|
| صفحة «المحتوى» | نصوص الموقع (عربي/إنجليزي) | `settings/content` |
| صفحة «المنتجات» | تعديلات المنتجات + روابط الصور | `settings/products` |
| السلايدر + العجلة | إعدادات الموقع | `settings/config` |

كل تعديل بيتكتب فورًا في Firestore و **بيظهر مباشرة (real-time)** لكل الزوار عبر
`onSnapshot`. لو Firebase مش متصل، نفس الكود بيستخدم localStorage تلقائيًا.

الملفات المسؤولة:
- `src/lib/firebase.js` — تهيئة Firebase (بـ fallback آمن).
- `src/lib/store.js` — طبقة تخزين موحّدة (Firestore أو localStorage).
- `src/context/*.js` — بتستخدم الطبقة دي.

---

## خطوات لاحقة مقترحة | Suggested next steps
البنية جاهزة لتوسيعها: ربط تسجيل دخول العملاء بـ Firebase Auth، تسجيل الطلبات في
`orders`, والتقييمات في `reviews` (القواعد جاهزة لكل ده في `firestore.rules`).
