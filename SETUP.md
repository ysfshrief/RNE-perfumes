# دليل الإعداد | Setup guide (Neon + Vercel)

الموقع شغال على قاعدة بيانات **Neon (Postgres)** من خلال API داخل المشروع نفسه
(`src/app/api/*`). من غير قاعدة بيانات، الموقع بيشتغل «وضع تجريبي» والبيانات
بتتحفظ في المتصفح بس.

The store runs on **Neon Postgres** through its own API routes. Without a
database it runs in local demo mode (data stays in the browser).

---

## ١) ربط Neon على Vercel (مرة واحدة)

1. Vercel → المشروع `rne-perfumes` → **Storage** → **Create Database** → **Neon**
   (أو اربط مشروع Neon موجود). Vercel هيضيف `DATABASE_URL` تلقائيًا لكل البيئات.
2. **Settings → Environment Variables** وضيف:
   | الاسم | القيمة |
   |------|--------|
   | `AUTH_SECRET` | أي نص عشوائي طويل (مثلًا ناتج `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
   | `ADMIN_CODE` | كود دخول الأدمن (الافتراضي `000` — يُفضّل تغييره) |
3. **Redeploy**. الجداول بتتعمل لوحدها أول ما الموقع يشتغل.
4. اتأكد: افتح `https://<الدومين>/api/health` → لازم يظهر `{"ok":true,"db":"connected"}`.

> ⚠️ `DATABASE_URL` و`AUTH_SECRET` سريين — **ماتحطهمش** بـ `NEXT_PUBLIC_`.

## ٢) الدخول للأدمن

اضغط **٣ مرات** على لوجو RNE في الفوتر ← اكتب الكود (`ADMIN_CODE`، الافتراضي `000`).
الكود بيتفحص على السيرفر، وبعدها المتصفح بياخد كوكي آمنة لمدة ١٢ ساعة.

## ٣) (اختياري) نقل بيانات Firebase القديمة

لو الموقع كان متوصّل بـ Firebase وفيه تعديلات أو طلبات:

```bash
npm i --no-save firebase-admin
# ضع ملف مفتاح الخدمة باسم serviceAccountKey.json في جذر المشروع (مايترفعش على GitHub)
DATABASE_URL="postgres://…" npm run migrate:firestore
```

حسابات العملاء (كلمات المرور) مش بتتنقل من Firebase — العميل يعمل حساب جديد.

---

## كيف يشتغل | How it works

| المكان | البيانات | في Neon |
|--------|----------|---------|
| المنتجات والمخزون | تعديلات الأدمن + المنتجات المضافة | `rne_documents` (key = `products`) |
| الإعدادات | الهيرو، السلايدر، الكوبونات، الدفع… | `rne_documents` (key = `config`) |
| النصوص | كل نصوص الموقع | `rne_documents` (key = `content`) |
| الطلبات / العملاء | | `rne_records` |
| حسابات العملاء | إيميل + كلمة مرور (scrypt) | `rne_users` |

- **الطلبات:** السيرفر بيحسب السعر والخصم والمخزون من قاعدة البيانات في transaction
  واحدة (مفيش حد يقدر يغيّر السعر من المتصفح، ومفيش طلبين ياخدوا آخر زجاجة).
- **الكوبونات:** أكوادها مش بتتبعت للمتصفح؛ التحقق بيحصل على السيرفر.
- **التحديث:** الزوار بيشوفوا تعديلات الأدمن عند فتح الصفحة، وعند الرجوع للتاب، وكل ٣٠ ثانية.

الملفات: `src/lib/server/*` (قاعدة البيانات، الجلسات، الطلبات)، `src/app/api/*`،
`src/lib/store.js` (طبقة البيانات في المتصفح).

## التطوير المحلي | Local development

```bash
cp .env.example .env.local   # ضع DATABASE_URL لقاعدة Neon للتطوير
npm install
npm run dev
```

للتجربة بدون Neon: `DATABASE_URL=pglite://memory` (Postgres داخل العملية — للاختبار فقط).
