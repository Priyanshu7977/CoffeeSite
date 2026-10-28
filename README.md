# ☕ NOIR DAKSHIN COFFEE ROASTERS

[![Live Demo](https://img.shields.io/badge/Demo-Live%20on%20Vercel-E05A7E?style=for-the-badge&logo=vercel&logoColor=white)](https://coffee-site-ivory.vercel.app/)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Verified%20Payments-0C2340?style=for-the-badge&logo=razorpay&logoColor=white)](https://razorpay.com/)
[![Vitest](https://img.shields.io/badge/Tests-46%2F46%20Passing-success?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **Artisanal Single-Estate Specialty Coffee E-Commerce Platform from the Western Ghats of India.**  
> Crafted with modern design aesthetics, full-stack Razorpay checkout, Firebase & secure custom authentication, real-time inventory management, 3D interactive tasting cards, and scientific extraction ritual guides.

**🌐 Live Storefront:** [https://coffee-site-ivory.vercel.app/](https://coffee-site-ivory.vercel.app/)  
**📦 GitHub Repository:** [https://github.com/Priyanshu7977/CoffeeSite](https://github.com/Priyanshu7977/CoffeeSite)

---

## 📖 Table of Contents

- [Overview & Brand Story](#-overview--brand-story)
- [Key Architectural Highlights](#-key-architectural-highlights)
- [Core Features & Interactive Experiences](#-core-features--interactive-experiences)
  - [1. Single-Estate Micro-Lot Catalog](#1-single-estate-micro-lot-catalog-12-numbered-tins)
  - [2. Interactive Brew Ritual Engine](#2-interactive-brew-ritual-engine)
  - [3. Western Ghats Estate Atlas](#3-western-ghats-estate-atlas)
  - [4. 3D Rolling Customer Reviews](#4-3d-rolling-customer-reviews)
  - [5. Full-Stack Payment Gateway (Razorpay & Custom UPI QR)](#5-full-stack-payment-gateway-razorpay--custom-upi-qr)
  - [6. Authentication & Customer Portal](#6-authentication--customer-portal)
  - [7. Real-Time Inventory Management System (IMS)](#7-real-time-inventory-management-system-ims)
  - [8. Abandoned Cart Recovery Automation](#8-abandoned-cart-recovery-automation)
- [Tech Stack](#-tech-stack)
- [REST API Reference](#-rest-api-reference)
- [Security, Cryptography & Chaos Invariants](#-security-cryptography--chaos-invariants)
- [Directory Structure](#-directory-structure)
- [Getting Started & Local Development](#-getting-started--local-development)
- [Environment Variables](#-environment-variables)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Deployment on Vercel](#-deployment-on-vercel)
- [License](#-license)

---

## ☕ Overview & Brand Story

**NOIR Dakshin Coffee Roasters** was founded in a hostel room and a 200 sq.ft garage studio in Indiranagar, Bengaluru. Rather than accepting ancient roasting dogmas, the roastery applies thermodynamics, convective heat transfer sensors, and optical Brix refractometry to highlight the terroir of Southern India's Western Ghats.

From high-elevation shade-grown Arabicas in Baba Budan Giri (the historic birthplace of Indian coffee) to oak-barrel-aged Canephora in Wayanad, each micro-lot is sourced directly from generational farm partners and packaged into vacuum-sealed numbered tins.

This repository houses the entire production codebase: a responsive storefront, custom animations, a full-stack Node.js serverless API, authentication, order ledger, inventory controls, and cryptographic payment verification.

---

## ⚡ Key Architectural Highlights

- **Dual-Engine Serverless & Local Architecture**: Runs as a lightweight Express dev server locally and compiles to optimized standalone Vercel Serverless Functions (`/api/[...all].js` & `/api/index.js`) using `esbuild`.
- **Zero Frontend Valuation Trust**: The frontend cart never dictates payment amounts. The backend server recalculates order totals authoritatively from database pricing, applies dynamic weight-based delivery and bulk thresholds, and signs orders with Razorpay.
- **Cryptographic Payment Integrity**: Every payment callback is validated using HMAC-SHA256 signatures (`razorpay_order_id|razorpay_payment_id`) against the secret key. Tampered amounts or mismatched signatures are automatically rejected.
- **Role-Based Inventory Guard (RBAC)**: An integrated Inventory Management System enforces atomic deductions, rollback safeguards, and strict role permissions (`ADMIN`, `IMS_ENGINEER`, `CUSTOMER`).
- **Resilient Multi-Method Auth**: Supports Firebase Authentication (Google OAuth, Phone SMS OTP, Email/Password) synchronized with an authoritative customer profile and order history store.
- **Performance & Aesthetics**: Tailored with a custom warm-cream and deep-espresso palette (`#FAF7F5`, `#2D2926`, `#1A1817`, `#F5DADF`, `#E05A7E`, `#C89658`), fluid typography, and sub-second load times.

---

## 🎯 Core Features & Interactive Experiences

### 1. Single-Estate Micro-Lot Catalog (12 Numbered Tins)

Every tin is traceable to its specific elevation, region, and varietal:

| Lot | Micro-Lot Name | Region & Terroir | Elevation | Processing | Tasting Notes | Price |
|:---:|:---|:---|:---:|:---|:---|:---:|
| **01** | **Baba Budan Obsidian** | Chikmagalur, Karnataka | 1,450m | Anaerobic Natural 72h | Dark Chocolate, Wild Black Cherry, Cacao Nib | ₹2,400 |
| **02** | **Malabar Monsooned Shore** | Malabar Coast, Kerala | Sea Level | 16-Week Monsoon Salt Air | Golden Crema, Earthy Malt, Pipe Tobacco | ₹2,100 |
| **03** | **Araku Valley Tribal Honey** | Eastern Ghats, Andhra | 1,200m | Yellow Honey Extended | Orange Blossom, Wild Forest Honey, Dried Fig | ₹2,600 |
| **04** | **Coorg Rainforest Peaberry** | Madikeri High Peaks | 1,350m | Washed Mountain Spring | Meyer Lemon, Bergamot, Roasted Hazelnut | ₹2,200 |
| **05** | **Dakshin Reserve 1998** | Shevaroy Hills, TN | 1,500m | Heritage Double Ferment | Sandalwood, Cardamom Pod, Black Plum | ₹3,200 |
| **06** | **Shevaroy Cloud Forest** | Yercaud Cloud Mist | 1,600m | Carbonic Maceration 96h | Starfruit, Lemongrass, Jasmine Florals | ₹2,800 |
| **07** | **Nilgiri Geisha** | Doddabetta Slopes | 2,250m | Carbonic Maceration 120h | Jasmine Perfume, Meyer Lemon, Wild Raspberry | ₹3,800 |
| **08** | **Biligiri Rangan Wild** | BR Hills Tiger Sanctuary | 1,950m | Wild Yeast Fermentation | Passion Fruit, Hazelnut, Wild Clover Honey | ₹2,900 |
| **09** | **Anamalai Dark Cacao** | Valparai Plateau, TN | 1,550m | Slow Sun-Dried Natural | 90% Dark Chocolate, Roasted Almond, Molasses | ₹2,300 |
| **10** | **Wayanad Robusta Royale** | Wayanad Highlands | 1,300m | Oak Barrel Matured 90d | Toasted Oak, Bourbon Vanilla, Spiced Tobacco | ₹2,100 |
| **11** | **Kodagu Wild Spice** | Coorg Pepper Forest | 1,250m | Natural Whole Cherry Dry | Cinnamon Bark, Nutmeg, Blackcurrant Cordial | ₹2,450 |
| **12** | **Chikmagalur Elephant AA** | Mullayanagiri Range | 1,700m | Fully Washed Glacier Springs | Crisp Green Apple, Toffee Crunch, Sweet Citrus | ₹2,750 |

---

### 2. Interactive Brew Ritual Engine

A scientific brewing guide with dynamic brew ratio calculators, grind profiles, water temperatures, and real-time brew timers for 5 iconic brewing methods:
- **Traditional South Indian Filter Kaapi**: 85:15 bean-chicory ratio, slow gravity drip into brass davarah-tumbler.
- **Pour Over (Hario V60 / Origami)**: 1:16 ratio with continuous spiral bloom pour.
- **French Press (Immersion)**: 1:15 coarse grind with 4-minute steep.
- **Inverted AeroPress**: 1:14 inverted agitation for concentrated espresso-style shot.
- **18-Hour Cold Brew**: 1:8 coarse cold extraction steeped at 4°C.

---

### 3. Western Ghats Estate Atlas

An interactive exploration across 6 distinct agronomic micro-regions:
- **Topographic Elevations & GPS Coordinates**
- **Canopy Shade Tree Ecosystems** (Silver Oak, Wild Fig, Rosewood, Cardamom)
- **Soil Composition** (Iron-rich Red Laterite, Humus Loam)
- **Harvest Cycles & Annual Rainfall Metrics**

---

### 4. 3D Rolling Customer Reviews

- **Celestia-Inspired Marquee**: Infinite smooth rolling customer testimonials with hover pause.
- **Interactive 3D Perspective Tilt**: Dynamic mouse-driven specular sheen and perspective depth.
- **Extraction Log Flip**: Click any card to inspect the customer's exact roast batch, grind setting, brew method, water temperature, and TDS extraction yield.

---

### 5. Full-Stack Payment Gateway (Razorpay & Custom UPI QR)

- **Razorpay Checkout Modal**: Direct pop-up supporting UPI Apps (Google Pay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, and Wallets.
- **Server-Side Order Generation**: Razorpay orders are generated via official SDK on `/api/payment/create-order` with secure server-side secrets.
- **HMAC-SHA256 Cryptographic Verification**: Signed on `/api/payment/verify-signature`.
- **Custom UPI QR & UTR Verification**: Static merchant QR codes with manual UTR transaction ID submission and Admin review.
- **Cash on Delivery (COD)**: Complete with instant order dispatch and invoice generation.

---

### 6. Authentication & Customer Portal

- **Flexible Multi-Auth**: Sign in using Email/Password, Google OAuth, or Phone OTP.
- **Customer Account Dashboard**:
  - Live order tracking with visual progress steps (*Order Placed -> Beans Allocated -> Drum Roasted -> Nitrogen Flushed -> Dispatched*).
  - Saved delivery addresses management (Add, Delete, Set Default).
  - Quick 1-Click Re-Order capability.
  - Profile editing with instant server persistence.
- **Cart Session Continuity**: Shopping cart items are preserved across login and logout events.

---

### 7. Real-Time Inventory Management System (IMS)

- **Role-Based Access Control**:
  - `ADMIN`: Full stock override, restock capability, and factory reset.
  - `IMS_ENGINEER`: Restock adjustments and batch logging.
  - `CUSTOMER`: Read-only stock checks.
- **Atomic Checkout Invariants**: When multiple items are purchased, stock is deducted in an atomic transaction. If any single item lacks inventory, the entire order is rolled back to prevent partial shipments.
- **Low-Stock Alerts**: Visual urgency triggers when stock reaches $\le 3$ tins.

---

### 8. Abandoned Cart Recovery Automation

A 3-stage customer re-engagement simulator:
- **1-Hour Gentle Reminder**: Informs customer their allocated micro-lot is reserved.
- **24-Hour Terroir Dossier**: Dispatches roaster's tasting guide for the cart's selected beans.
- **48-Hour Urgency & 10% Discount**: Unlocks exclusive promo code `DAKSHIN10` before releasing reserved tins.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite 8](https://vitejs.dev/) with `@tailwindcss/vite`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation & Motion**: [Framer Motion](https://www.framer.com/motion/), [GSAP 3](https://greensock.com/gsap/), [Lenis Smooth Scroll](https://lenis.darkroom.engineering/)
- **Icons & Visuals**: [Lucide React](https://lucide.dev/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Routing**: [React Router v7](https://reactrouter.com/)

### Backend & API
- **Server**: [Node.js](https://nodejs.org/) & [Express 5](https://expressjs.com/)
- **Deployment**: [Vercel Serverless Functions](https://vercel.com/docs/functions)
- **Bundler**: [esbuild](https://esbuild.github.io/) (bundles server entry into standalone ESM for Vercel)
- **Payment Processing**: Official [Razorpay Node SDK](https://github.com/razorpay/razorpay-node)
- **Authentication**: [Firebase v13 SDK](https://firebase.google.com/) + Custom Server UsersStore

### Quality Assurance & Linting
- **Testing Engine**: [Vitest 5](https://vitest.dev/)
- **Linter**: [Oxlint](https://oxc.rs/)

---

## 🔌 REST API Reference

The backend API is served at `/api` on Vercel and `http://localhost:5000/api` locally:

| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---:|
| `GET` | `/api/health` | Service health & Razorpay credential check | None |
| `GET` | `/api/payment/config` | Public Razorpay Key ID & UPI QR configuration | None |
| `POST` | `/api/payment/create-order` | Validates items, calculates valuation, creates Razorpay order | None |
| `POST` | `/api/payment/verify-signature` | Cryptographically verifies Razorpay payment signature | None |
| `POST` | `/api/payment/submit-utr` | Submits UTR transaction ID for manual UPI QR orders | None |
| `POST` | `/api/payment/webhook` | Handles automated Razorpay webhook payment events | HMAC Signature |
| `GET` | `/api/orders/my-orders` | Retrieves user's previous order history | Optional User Email |
| `GET` | `/api/orders/:orderId` | Retrieves specific order details and tracking status | None |
| `GET` | `/api/admin/orders` | Retrieves all orders for administrative audit | Admin Credentials |
| `POST` | `/api/admin/verify-utr` | Approves or rejects custom UPI UTR payment | Admin Credentials |
| `POST` | `/api/auth/register` | Creates a new user profile with hashed password | None |
| `POST` | `/api/auth/login` | Authenticates user credentials and returns session token | None |
| `POST` | `/api/auth/sync` | Syncs Google OAuth / Phone OTP Firebase user to database | None |
| `GET` | `/api/auth/profile` | Fetches active customer profile & addresses | Bearer Token |
| `POST` | `/api/auth/update-profile` | Updates name and phone number | Bearer Token |
| `POST` | `/api/auth/address` | Adds or updates saved shipping address | Bearer Token |
| `DELETE` | `/api/auth/address/:addressId` | Deletes saved shipping address | Bearer Token |

---

## 🛡️ Security, Cryptography & Chaos Invariants

1. **No Client-Side Valuation**: Frontend prices and total calculations are strictly informational. The backend server maintains the single source of truth for micro-lot prices, delivery surcharges, and discounts.
2. **HMAC-SHA256 Cryptographic Signature Verification**:
   $$\text{Signature} = \text{HMAC-SHA256}(\text{order\_id} + "|" + \text{payment\_id},\, \text{RAZORPAY\_KEY\_SECRET})$$
   Any tampered payload is immediately aborted with HTTP 400.
3. **No Secret Leakage**: The client bundle (`Vite`) strictly receives `VITE_RAZORPAY_KEY_ID`. The `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` are never bundled into frontend assets.
4. **Chaos Invariants**: Stock allocations can never fall below 0 under high concurrency or negative input manipulation.

---

## 📂 Directory Structure

```text
CoffeeSite/
├── api/                       # Bundled Vercel serverless entry points
│   ├── index.js               # Root handler
│   └── [...all].js            # Catch-all API rewrite handler
├── public/                    # Static assets (favicons, manifest)
├── src/
│   ├── assets/                # Local images, SVG brandmarks
│   ├── components/            # Reusable UI components
│   │   ├── CheckoutModal.tsx      # Multi-method checkout modal (Razorpay, UPI QR, COD)
│   │   ├── CollectionPage.tsx     # 12-lot catalog grid with quick-add & details
│   │   ├── CollectionDrawer.tsx   # Slide-out interactive cart drawer
│   │   ├── Hero.tsx               # Cinematic brand headline with smooth action triggers
│   │   ├── InventoryHudModal.tsx  # Admin IMS dashboard for live inventory adjustments
│   │   ├── Navbar.tsx             # Responsive nav with cart badge, auth, & quick links
│   │   ├── ReviewsRollingSection.tsx # 3D rotating marquee customer reviews
│   │   ├── SectionBrewRitual.tsx  # 5-method brew ritual guide & ratio calculator
│   │   ├── SectionManifesto.tsx   # Three pillars of Noir Dakshin roasting
│   │   └── ...
│   ├── context/               # Global Cart & Auth state providers
│   ├── data/                  # Static coffee lot data & brewing parameters
│   ├── pages/                 # Top-level view routes
│   │   ├── AboutUsPage.tsx        # Story of hostel room origins & Western Ghats expedition
│   │   ├── AccountPage.tsx        # Customer profile, live tracking, & saved addresses
│   │   ├── CartPage.tsx           # Full cart review with free shipping bar & discount engine
│   │   ├── EstateAtlasPage.tsx    # 6-region Western Ghats agronomic terroir atlas
│   │   ├── LoginPage.tsx          # Premium coffee-themed login & multi-auth modal
│   │   ├── ProductDetailPage.tsx  # Micro-lot deep dive, tasting notes, & brew guide
│   │   └── SignupPage.tsx         # Customer profile registration & validation
│   ├── server/                # Backend API implementation
│   │   ├── app.ts                 # Express routing & controller logic
│   │   ├── entry.ts               # Serverless bundle entry for esbuild
│   │   ├── ordersStore.ts         # In-memory & persisted order ledger
│   │   ├── pricing.ts             # Authoritative server-side valuation engine
│   │   ├── razorpayClient.ts      # Razorpay SDK client & cryptographic verifier
│   │   ├── server.ts              # Local standalone Express dev server
│   │   └── usersStore.ts          # Customer profile store & authentication
│   ├── types/                 # Shared TypeScript interfaces
│   ├── utils/                 # Inventory manager, validations, & helpers
│   └── __tests__/             # Comprehensive Vitest test suites (46 tests)
│       ├── authentication.test.ts     # User registration, login, & session security
│       ├── emailAutomation.test.ts    # Abandoned cart recovery triggers
│       ├── inventorySystem.test.ts    # RBAC security & atomic transaction guards
│       ├── orderIntegration.test.ts   # End-to-end checkout & order creation
│       ├── penetrationSecurity.test.ts# Signature tampering & injection defense
│       └── razorpayPayment.test.ts    # Razorpay order generation & verification
├── .env.example               # Template for environment configuration
├── package.json               # NPM scripts & dependencies
├── tsconfig.json              # TypeScript compilation configuration
├── vercel.json                # Vercel routing rules & serverless rewrite configuration
└── vite.config.ts             # Vite build pipeline with Tailwind CSS v4
```

---

## 🚀 Getting Started & Local Development

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Razorpay Account** (Optional for payment testing): [https://dashboard.razorpay.com](https://dashboard.razorpay.com)

### 2. Clone the Repository
```bash
git clone https://github.com/Priyanshu7977/CoffeeSite.git
cd CoffeeSite
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your credentials (see [Environment Variables](#-environment-variables)).

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
# ========================================================
# RAZORPAY CONFIGURATION (Test or Live)
# ========================================================
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_secret_key_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here

# Client-facing Razorpay Key (Public Key ID only)
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here

# Backend Port (For local Express development)
PORT=5000

# API Base URL (Leave empty for same-origin proxy in development & Vercel)
VITE_API_BASE_URL=

# ========================================================
# FIREBASE AUTHENTICATION CONFIGURATION
# ========================================================
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🧪 Testing & Quality Assurance

The project includes 46 unit, integration, and security tests built with [Vitest](https://vitest.dev/):

```bash
npm test
```

### Test Suite Coverage

```text
✓ src/__tests__/authentication.test.ts      (9 tests)  - Register, Login, Duplicate Prevention, Token Security
✓ src/__tests__/penetrationSecurity.test.ts (11 tests) - Tampering, SQLi/XSS Sanitization, HMAC Bypass Defense
✓ src/__tests__/inventorySystem.test.ts     (10 tests) - RBAC permissions, Atomic Rollback, Stock Invariants
✓ src/__tests__/orderIntegration.test.ts    (1 test)   - End-to-end checkout flow & order tracking
✓ src/__tests__/emailAutomation.test.ts     (6 tests)  - 1h, 24h, 48h re-engagement automation cycles
✓ src/__tests__/razorpayPayment.test.ts     (9 tests)  - Order creation, signature check, webhook validation

Test Files:  6 passed (6)
Tests:       46 passed (46)
```

---

## 🌐 Deployment on Vercel

The application is pre-configured for one-click deployment on [Vercel](https://vercel.com):

1. **Connect GitHub Repository**: Import `Priyanshu7977/CoffeeSite` into your Vercel Dashboard.
2. **Configure Environment Variables**:
   Add the following in **Settings > Environment Variables**:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `RAZORPAY_WEBHOOK_SECRET`
   - `VITE_RAZORPAY_KEY_ID`
   - `VITE_FIREBASE_API_KEY` (and other `VITE_FIREBASE_*` variables)
3. **Build Command**: Set to `npm run build` (`tsc -b && vite build && npm run build:api`).
4. **Output Directory**: Set to `dist`.
5. **Deploy**: Vercel will automatically build the static frontend and deploy the serverless functions under `/api`.

---

## 📜 License

This project is open-source and distributed under the [MIT License](LICENSE).

---

<p align="center">
  Crafted with passion, thermodynamics, and single-estate coffee in Bengaluru, India. 🇮🇳☕
</p>
