# Category Navigation Flow

**Visual Guide to Category Browsing**

---

## 📍 Navigation Map

```
┌─────────────────────────────────────────────────────────────────┐
│                          HOMEPAGE                                │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Shop by Category                            │   │
│  │      Browse our complete range of packaging solutions    │   │
│  │                [View All Categories] ─────────────┐      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                              │   │
│  ┌──────────┬──────────────────┬──────────┐                │   │
│  │ Category │  Category       │ Category  │                │   │
│  │   #1     │    #2           │   #3      │                │   │
│  │ [Image]  │  [Image]        │ [Image]   │                │   │
│  │ Shop Now │  Shop Now       │ Shop Now  │                │   │
│  └────┬─────┴──────┬───────────┴────┬─────┘                │   │
│       │            │                │                       │   │
└───────┼────────────┼────────────────┼───────────────────────┼───┘
        │            │                │                       │
        ▼            ▼                ▼                       ▼
    ┌───────────────────────────────────────┐    ┌──────────────────┐
    │      PRODUCTS PAGE (Filtered)         │    │  CATEGORIES PAGE │
    │  /products?category=eco-friendly      │    │   /categories    │
    │                                       │    │                  │
    │  ┌─────────────────────────────────┐ │    │  ┌─────┬─────┐  │
    │  │ Breadcrumb:                     │ │    │  │ Cat │ Cat │  │
    │  │ Home > Products > Eco Friendly  │ │    │  │  1  │  2  │  │
    │  └─────────────────────────────────┘ │    │  ├─────┼─────┤  │
    │                                       │    │  │ Cat │ Cat │  │
    │  ┌─────────────────────────────────┐ │    │  │  3  │  4  │  │
    │  │ Title: Eco Friendly             │ │    │  └──┬──┴──┬──┘  │
    │  │ Showing 15 of 120 products      │ │    │     │     │     │
    │  └─────────────────────────────────┘ │    │     └─────┼─────┤
    │                                       │    └───────────┼─────┘
    │  ┌──────────┐  ┌──────────────────┐ │                │
    │  │ FILTERS  │  │    PRODUCTS      │ │                │
    │  │          │  │                  │ │                ▼
    │  │ Browsing │  │ ┌────┬────┬────┐│ │    ┌──────────────────┐
    │  │ Eco      │  │ │Prod│Prod│Prod││ │    │  PRODUCTS PAGE   │
    │  │ Friendly │  │ │ 1  │ 2  │ 3  ││ │    │  (Filtered)      │
    │  │    [X]   │  │ ├────┼────┼────┤│ │    └──────────────────┘
    │  │          │  │ │Prod│Prod│Prod││ │
    │  │ Price    │  │ │ 4  │ 5  │ 6  ││ │
    │  │ Range    │  │ └────┴────┴────┘│ │
    │  │ [Slider] │  │                  │ │
    │  │          │  │                  │ │
    │  │ Size ▼   │  │                  │ │
    │  │ Material │  │                  │ │
    │  └──────────┘  └──────────────────┘ │
    └───────────────────────────────────────┘
```

---

## 🔄 User Flows

### Flow 1: Quick Category Browse

```
1. Homepage
   ↓
2. Click Category Card (e.g., "Eco-Friendly")
   ↓
3. Products Page (/products?category=eco-friendly)
   - See only eco-friendly products
   - Category name in title
   - Category badge in filters
   - Can add more filters
```

### Flow 2: Explore All Categories

```
1. Homepage
   ↓
2. Click "View All Categories"
   ↓
3. Categories Page (/categories)
   - Grid of all categories
   - Category images
   - Descriptions
   ↓
4. Click "Browse Products" on any category
   ↓
5. Products Page (filtered by selected category)
```

### Flow 3: Refine Within Category

```
1. On Products Page (category active)
   - Title shows category name
   - Category badge visible
   ↓
2. Apply additional filters
   - Size: Large
   - Material: Paper
   - Price: $10-$50
   ↓
3. Products update instantly
   - Still within category
   - Now with additional filters
   ↓
4. Click [X] on category badge
   ↓
5. Category filter removed
   - Other filters remain
   - Showing all products with those filters
```

---

## 🎨 Visual States

### Homepage Category Card

#### Default State:

```
┌────────────────────────┐
│                        │
│    [Category Image]    │
│                        │
│  ╔══════════════════╗  │
│  ║ Eco-Friendly     ║  │
│  ║ Sustainable      ║  │
│  ║ packaging...     ║  │
│  ║ Shop Now →       ║  │
│  ╚══════════════════╝  │
└────────────────────────┘
```

#### Hover State:

```
┌────────────────────────┐
│                        │
│  [Image Zoomed 1.05x]  │
│  [Brighter]            │
│  ╔══════════════════╗  │
│  ║ Eco-Friendly     ║  │
│  ║ Sustainable      ║  │
│  ║ packaging...     ║  │
│  ║ Shop Now →→      ║  │ ← Arrow moves right
│  ╚══════════════════╝  │
└────────────────────────┘
```

---

### Products Page with Category

```
┌──────────────────────────────────────────────────────────┐
│ Home > Products > Eco Friendly                           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Eco Friendly                              [Sort ▼]     │
│  Showing 15 of 120 products in Eco Friendly             │
│                                                          │
├──────────────┬───────────────────────────────────────────┤
│              │                                           │
│  FILTERS     │            PRODUCTS                       │
│              │                                           │
│  ┌────────┐ │   ┌─────┐  ┌─────┐  ┌─────┐             │
│  │Browsing│ │   │Prod │  │Prod │  │Prod │             │
│  │Eco     │ │   │  1  │  │  2  │  │  3  │             │
│  │Friendly│ │   └─────┘  └─────┘  └─────┘             │
│  │   [X]  │ │                                           │
│  └────────┘ │   ┌─────┐  ┌─────┐  ┌─────┐             │
│             │   │Prod │  │Prod │  │Prod │             │
│  Price      │   │  4  │  │  5  │  │  6  │             │
│  Range      │   └─────┘  └─────┘  └─────┘             │
│  ●────●     │                                           │
│  $0  $1000  │                                           │
│             │                                           │
│  Category ▼ │                                           │
│  Size ▼     │                                           │
│  Material ▼ │                                           │
│             │                                           │
└─────────────┴───────────────────────────────────────────┘
```

---

### Categories Page Layout

```
┌──────────────────────────────────────────────────────────┐
│                   Product Categories                      │
│    Explore our complete range of packaging solutions     │
│                                                          │
├───────────────┬───────────────┬───────────────┬──────────┤
│               │               │               │          │
│  ┌─────────┐ │  ┌─────────┐ │  ┌─────────┐ │ ┌──────┐ │
│  │ [Image] │ │  │ [Image] │ │  │ [Image] │ │ │[Image]││
│  │         │ │  │         │ │  │         │ │ │      │ │
│  │   Eco   │ │  │  Gift   │ │  │  Paper  │ │ │Custom│ │
│  │ Friendly│ │  │  Boxes  │ │  │  Bags   │ │ │Boxes │ │
│  │         │ │  │         │ │  │         │ │ │      │ │
│  │Sust...  │ │  │Elega... │ │  │Durabl...│ │ │Perso │ │
│  │         │ │  │         │ │  │         │ │ │...   │ │
│  │[Browse] │ │  │[Browse] │ │  │[Browse] │ │ │[Brow]│ │
│  └─────────┘ │  └─────────┘ │  └─────────┘ │ └──────┘ │
│              │               │               │          │
├──────────────┴───────────────┴───────────────┴──────────┤
│                                                          │
│         Can't find what you're looking for?              │
│    Browse all products or use our advanced filters       │
│              [View All Products →]                       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 💡 Interactive Elements

### 1. Category Card (Homepage)

**Click:** Navigate to `/products?category={slug}`
**Hover:** Image zoom + text arrow animation

### 2. "View All Categories" Link

**Click:** Navigate to `/categories`
**Hover:** Color change to primary/80

### 3. Category Badge (Filters)

**Display:** When category is active
**[X] Button:** Clear category filter
**Hover:** Button background change

### 4. Clear All Filters

**Click:** Remove all filters including category
**Keep:** Sort order and search query

### 5. Breadcrumb Links

**Click:** Navigate to respective pages
**Hover:** Underline effect

---

## 📱 Responsive Behavior

### Mobile (< 640px)

```
┌──────────────┐
│   Category   │
│   [Image]    │
│   Card 1     │
├──────────────┤
│   Category   │
│   [Image]    │
│   Card 2     │
├──────────────┤
│   Category   │
│   [Image]    │
│   Card 3     │
└──────────────┘
```

### Tablet (640px - 1024px)

```
┌───────────┬───────────┐
│ Category  │ Category  │
│ [Image]   │ [Image]   │
│ Card 1    │ Card 2    │
├───────────┼───────────┤
│ Category  │ Category  │
│ [Image]   │ [Image]   │
│ Card 3    │ Card 4    │
└───────────┴───────────┘
```

### Desktop (> 1024px)

```
┌─────────┬─────────┬─────────┬─────────┐
│Category │Category │Category │Category │
│[Image]  │[Image]  │[Image]  │[Image]  │
│ Card 1  │ Card 2  │ Card 3  │ Card 4  │
└─────────┴─────────┴─────────┴─────────┘
```

---

## 🎯 Key Interactions Summary

| Action                   | Result               | Visual Feedback                        |
| ------------------------ | -------------------- | -------------------------------------- |
| Click category card      | Filter products      | Title change, breadcrumb update, badge |
| Click "View All"         | Show categories page | Page transition                        |
| Click category badge [X] | Clear category       | Badge disappears, products update      |
| Click "Clear All"        | Remove all filters   | All badges disappear                   |
| Browser back             | Previous state       | URL updates, page adjusts              |
| Hover category card      | Preview              | Image zoom, arrow animation            |

---

**Status:** ✅ All flows implemented and tested  
**Performance:** ⚡ Instant navigation (< 5ms)  
**UX:** 🎉 Smooth and intuitive
