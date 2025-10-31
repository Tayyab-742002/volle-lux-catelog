# Design Document: "Volle" E-commerce Platform (v2.1)

**Project:** "Volle" B2B/B2C E-commerce Platform
**Version:** 2.1
**Status:** In Review
**Aligned with:** PRD.md (v1.1) | Architecture.md (v1.1)

---

## 1.0 Introduction

### 1.1 Project Objective

To design a high-performance, visually immersive, and functionally seamless e-commerce platform for premium packaging supplies. The core challenge is to create a single, intuitive user interface that automatically handles both B2C (retail) and B2B (wholesale) purchasing through a dynamic, tiered pricing model, without any separate "business" sections for the user.

### 1.2 Core Design Philosophy: "Immersive Minimalism & Performant Luxury"

The aesthetic is an evolution of minimalism. We will use space and high-impact graphics as the design itself. The experience must feel less like using a "site" and more like interacting with a high-end digital catalog.

---

## 2.0 Core Design Principles

### 2.1 Immersive Minimalism

The design will be extremely clean. Layouts are spacious and uncluttered to the point of being artistic. All non-essential UI, borders, and lines will be removed, relying on spacing and typography for structure.

### 2.2 Graphic-Rich & Luxury

The premium "rich" feeling will be achieved through:

- **Full-Bleed, Magazine-Quality Photography:** Graphics are not _on_ the page; they _are_ the page. We will use large, professional, full-width images and videos.
- **Typography as a Graphic Element:** Text is not just for information; it's a key part of the visual hierarchy. We will use a combination of large, bold headings and delicate, light-weight labels.

### 2.3 Fluidity & Smoothness

The interface must feel instant, fluid, and responsive. Animations will be almost invisible—subtle fades, gentle transforms—giving the UI a "buttery smooth" and high-quality physical feel.

---

## 3.0 Visual Identity & Design System

### 3.1 Color Palette (Shadcn UI Default Theme)

The palette will be based on the **default Shadcn UI / Tailwind CSS theme** to ensure consistency, speed, and proven accessibility. This theme is characterized by its use of neutral grays (like `slate` or `zinc`) for structure and a clean primary color for interactions.

- **Primary (Structure & Text):** The theme's default `foreground` color (e.g., `slate-900` or `zinc-900` in light mode).
  - _Usage:_ All text, headers, and footers for a strong, high-contrast look.
- **Accent (Action & Conversion):** The theme's default `primary` color (e.g., the default `blue` or `zinc`).
  - _Usage:_ Primary CTAs (Add to Cart, Checkout), selected states, and sale badges.
- **Neutrals (Clarity & Space):**
  - **Page Background:** The theme's `background` color (e.g., `white` or `slate-50`).
  - **Panel Background:** The theme's `card` or `muted` color (e.g., `slate-100` or `zinc-100`).
    - _Usage:_ Input fields, subtle background sections.
  - **Borders & Dividers:** The theme's `border` color (e.g., `slate-200`).
    - _Usage:_ To be avoided wherever possible, but used for inputs and accordions.
- **System Colors:**
  - **Error:** The theme's `destructive` color (red).
  - **Success:** A standard `green` (e.g., `green-600`).

### 3.2 Typography

- **Font Family:** `Roboto` (Variable Font).
- **Headings (h1, h2):** `Bold (700)` weight.
- **Subheadings (h3, h4):** `Regular (400)` or `Medium (500)` weight.
- **Body & UI Elements:** `Regular (400)` weight, 16px base, with a generous line height.
- **Labels & Meta (SKU, Breadcrumbs):** `Medium (500)` weight, 12px, `all-caps`, with `letter-spacing: 0.1em`.

### 3.3 Iconography

- **Set:** `Lucide Icons` (default for Shadcn).
- **Style:** Thin, consistent stroke-width (e.g., 1.5px).

### 3.4 Grid & Spacing

- **Grid:** A strict 12-column responsive grid.
- **Spacing:** An 8px base scale is mandatory. We will lean towards larger spacing values (24px, 32px, 48px, 64px) to create an open, luxury feel.

---

## 4.0 Key Page Blueprints

### 4.1 The Landing Page ("Immersive Showcase")

- **Goal:** A visually stunning, graphic-rich "welcome mat" that wordlessly communicates quality and breadth.
- **Header:** Minimalist sticky header on a pure `background` color.
  - _Layout:_ Logo (left), main navigation links (center, text-only), icons for Search, Account, Cart (right).
- **Main Navigation:** A "Mega Menu" on hover for "Products." Full-width, clean `background` color, 2-3 columns of text links, and one column for a featured product image.
- **Hero Section:** Full-width, full-bleed, screen-height (`100vh`) professional video loop or high-res photograph.
  - _Headline:_ Minimal text overlaid (e.g., "The Standard in Professional Packaging.")
  - _Search Bar:_ The only other element. A clean, long search bar (`panel background` color, `foreground` text).
- **Trust Bar (Subtle):** A minimal, centered text line: "NEXT DAY DELIVERY • ECO-FRIENDLY OPTIONS • AUTOMATIC BULK PRICING".
- **"Shop by Category" Grid:** A visually dynamic, asymmetrical (masonry) grid of 4-5 main categories.
  - _Card Design:_ Large, high-res images in different aspect ratios. The category title is overlaid in a large, bold, white font.
  - _Hover:_ Subtle zoom (`transform: scale(1.05)`) and brightening effect.
- **"Featured Products" Carousel:** A horizontal, flick-scrollable carousel with large gaps between items.
  - **Product Card (Critical):**
    - _Image:_ 90% of the card, cutout on a pure `background` color.
    - _Badge:_ Small `Accent` color pill badge (e.g., "-20%").
    - _Info:_ Product Title (bold), Star Rating, Price (e.g., "From $1.99").
    - _Inline Variants:_ 3-4 primary size variants as small, clickable text buttons (e.g., "C4", "C5", "C6").
    - _Hover:_ No border. A subtle box-shadow appears, and the card gently lifts (`transform: translateY(-4px)`).
- **Sustainability Block:** A full-width, 50/50 split section. Left: Abstract eco-themed image. Right: `Panel Background` color with heading and short paragraph.
- **"New Arrivals" Section:** A second product carousel, identical to "Featured Products."
- **Footer:** `Primary (Structure)` color background with `background` (white/light) text. Simple 4-column layout (Shop, Support, Company, Contact).

### 4.2 Product Listing Page (PLP) / Category Page

- **Goal:** Clean, fast, efficient filtering.
- **Layout:** 2-column: Sticky Sidebar (Filters) | Main Content (Product Grid).
- **Header:** Breadcrumbs (all-caps, letter-spaced style), Category Title (Large, Bold H1), Sorting Dropdown.
- **Filters (Sidebar):** Use `Shadcn Accordion`. All-caps labels (SIZE, MATERIAL, COLOR).
- **Product Grid:** A 3 or 4-column responsive grid using the master Product Card design.

### 4.3 Product Detail Page (PDP)

- **Goal:** Convert all users by providing dynamic pricing with absolute clarity.
- **Layout:** 2-column with massive white space (e.g., 40% | 60% split).
- **Product Gallery:** Large main image. Thumbnails are displayed as small "dots" or a minimal horizontal list below.
- **Info & Purchase Block:**
  - **Breadcrumbs:** All-caps, letter-spaced style.
  - **Product Title:** H1, very large.
  - **SKU / Product Code:** All-caps, letter-spaced style.
  - **Variant Selectors:** Clean, rectangular buttons (`Shadcn Toggle Group`). Selected state uses the `Accent` color for the border.
  - **Dynamic Pricing Engine (Core Feature):** A clean, borderless table.

| Quantity    | Price per Unit    |
| :---------- | :---------------- |
| 1–49 units  | $2.50             |
| 50–99 units | $2.25 (10% Off)   |
| 100+ units  | $2.00 (Wholesale) |

    * **Quantity Selector:** A minimal input field.
    * **Dynamic Price:** A large price display (e.g., "$2.50 / unit"). Must update instantly based on quantity, highlighting the active tier in the table (e.g., text turns `Accent` color).
    * **Add to Cart Button:** Full-width, `Accent` color button.
    * **Collapsible Info:** Use `Accordion` with all-caps labels (DESCRIPTION, SPECIFICATIONS, DELIVERY).

### 4.4 Shopping Cart & Checkout

- **Goal:** A frictionless, high-trust, and on-brand experience.
- **Mini-Cart:** Use a `Shadcn Sheet` (slide-out panel from the right).
- **Full Cart Page:** Extremely minimal. Must feature a clear list of items.
- **Order Summary (Critical):** Must be transparent and itemized.
  - `Subtotal: $500.00`
  - `Wholesale Discount: -$75.00`
  - `Shipping: $15.00`
  - `Total: $440.00`
- **Checkout:** A minimal, single-page, or 3-step wizard.
  - **Guest Checkout:** Must be prominently featured _before_ login.
  - **Payment:** Securely handled by `Stripe Elements`.
- **Order Confirmation Page:** A clear "Thank You" message, order summary, and "Track Order" link.

### 4.5 User Account Dashboard

- **Goal:** A clean, functional, and self-service portal. No "B2B" language.
- **Layout:** 2-column: Vertical Navigation (left) | Content Area (right).
- **Navigation:** Dashboard (overview), Order History, Saved Addresses, Download Invoices, Account Settings.
- **Order History:** A clean table of all past orders with status badges.
- **Order Details Page:** Must provide "Reorder" and "Download Invoice (PDF)" buttons.

### 4.6 Static Content Pages (About, FAQ, etc.)

- **Layout:** Clean, typography-first. A centered `prose` layout with large, bold headings and readable, spaced-out body text.
- **FAQ Page:** Use an `Accordion` for question/answer pairs.
- **Contact Page:** Simple form (using `Resend`) and clear Phone/Email details.

---

## 5.0 Admin Dashboard & CMS Requirements

- **Goal:** Efficient internal operations.
- **Sanity CMS (Product & Content):**
  - _Interface for:_ Add/Edit/Delete Products, Manage Variants, Manage Categories, Manage Pricing Rules & Tiers, Upload Images, Edit Static Pages (About, FAQ).
- **Next.js Admin Dashboard (Operations):**
  - _Interface for:_ View/Manage Orders, Update Order Status, View Customer List, Approve/Reject Custom Quote Requests, Export Orders (CSV).

---

## 6.0 Animation & Performance Requirements

### 6.1 Core Principle

Performance is the foundation of luxury. All design choices must prioritize immediate load times.

### 6.2 Micro-interactions & Animation

Animations will be subtle, fluid, and almost invisible (e.g., gentle fades, smooth transforms). The goal is a "buttery smooth" feel that responds instantly to user input.

### 6.3 Technical Constraints

- Prioritize low **Largest Contentful Paint (LCP)** and fast **Time to Interactive (TTI)**.
- All animations must be **GPU-accelerated** (using `transform` and `opacity` properties).
- Animations must **never cause layout shift**.

---

## 7.0 Implementation & Tech Stack

### 7.1 Tech Stack

- **Framework/Hosting:** Next.js (on Vercel)
- **UI:** Tailwind CSS / Shadcn
- **Backend (Auth, Orders, Profiles):** Supabase
- **CMS (Products, Content):** Sanity
- **Payment:** Stripe
- **Email:** Resend

### 7.2 Design Mockup Phase

For the initial design and build, integration with Supabase and Sanity is not required. The focus is to create a full, complete, functional design using `mockData.js` or JSON files. However, the functions, data services, and API structures (e.g., `services/supabaseService.js`, `lib/sanityClient.js`) must be created, and the design must be built to expect the real data structure.
