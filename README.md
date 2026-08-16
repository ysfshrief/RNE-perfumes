# RNE Perfumes — E-Commerce Storefront

A premium, mobile-first e-commerce prototype for **RNE Perfumes**, built with
Next.js (App Router). This is a **front-end prototype with mock data** — a
complete, deployable UI that maps directly to the project blueprint, ready to
push to Vercel.

---

## Tech stack

- **Next.js 14** (App Router)
- **React 18**
- CSS Modules + a design-token system (no CSS framework)
- Client-side cart & wishlist state persisted in `localStorage`
- Fonts: Syne (display) + Inter (body), loaded from Google Fonts

No backend or database is included. All product, order, customer, and review
data is mock data under `src/data/`.

---

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

### Build for production

```bash
npm run build
npm start
```

---

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Vercel auto-detects Next.js. No environment variables are needed for the
   prototype. Click **Deploy**.

Alternatively, with the Vercel CLI:

```bash
npm i -g vercel
vercel
```

---

## What's included

### Storefront
- **Home** — hero, categories, best sellers, editorial section
- **Shop** — search, category / size / price / rating filters, sort, mobile drawer
- **Product details** — gallery, size + stock, fragrance-note pyramid, reviews
- **Cart** — quantities, coupon codes (`RNE10`, `SAVE50`), totals
- **Checkout** — delivery form, all six payment methods, order confirmation
- **Account** — login / register / orders / profile / addresses (mock auth)
- **Wishlist**
- **Content pages** — About, Contact, FAQ, Shipping, Returns, Terms
- Global footer with mandatory copyright, floating WhatsApp button

### Admin dashboard (`/admin`)
- **Overview** — stats, recent orders, low-stock alerts
- **Products** — table with hide/show, delete, stock, best-seller flags
- **Orders** — status flow (New → Confirmed → Preparing → Out for Delivery →
  Delivered, plus Cancelled / Returned) with per-order management
- **Customers**, **Reviews** (approve / hide / delete), **Discounts** (create
  coupons), **Content** editor, **Settings** (payment methods, gateway,
  Meta Pixel, WhatsApp, social links)

---

## Important notes for production

This prototype intentionally does **not** implement the security-critical
backend logic described in the blueprint. Before going live you'll need:

- A real backend + database (products, orders, customers, reviews, inventory)
- Server-side auth (the UI is structured to be auth-provider agnostic)
- **Inventory deducted only when an order is set to `Confirmed`** — enforced
  server-side, not in the UI
- Server-side price & stock validation (never trust the client)
- Real payment gateway integration (configurable from Admin → Settings)
- Shipping provider integration (deferred per blueprint)

The front-end is organized to make adding this backend straightforward:
data access is isolated in `src/data/`, and shopping state lives in
`src/context/ShopContext.js`.

---

## Project structure

```
src/
  app/                 # routes (App Router)
    admin/             # admin dashboard
    product/[slug]/    # dynamic product pages
    shop/ cart/ ...    # storefront pages
  components/          # Header, Footer, ProductCard, etc.
  context/             # cart & wishlist state
  data/                # mock product / review data
```

---

جميع الحقوق محفوظة RNE perfumes

Developed & designed by : Youssef Shrief
