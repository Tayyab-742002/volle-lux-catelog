# Product Requirements Document: B2B/B2C E-commerce Platform

**Document Version:** 1.1
**Date:** October 25, 2025
**Owner:** Project Stakeholder
**Status:** Revised

---

## 1. Introduction

### 1.1. Document Purpose

This document details the functional and non-functional requirements for a new e-commerce platform. Its purpose is to serve as the single source of truth for the project team (designers, developers, and QA) to ensure all features are built to specification.

### 1.2. Project Objective

The primary objective is to build a robust, dual-mode e-commerce system that serves all customers from a single storefront. The system's core logic will center on a dynamic pricing engine that automatically applies tiered discounts based on order quantity, regardless of user type.

### 1.3. Scope

This PRD covers all customer-facing features, the shopping and checkout flow, user account functionality, and the complete administrative (CMS) backend for managing products, orders, and pricing.

---

## 2. User Roles & Personas

### 2.1. Customer (Guest or Registered User)

- **Description:** Any individual or business representative visiting the site. There is no distinction between B2C and B2B accounts; all users are "Customers."
- **Goal:** To browse, find, and purchase products.
- **Key Needs:**
  - Clear, standard pricing for small-quantity orders.
  - Automatic and transparent application of bulk discounts when purchasing large quantities.
  - A simple, fast, and secure checkout process, with a guest checkout option.
  - (If registered) Access to order history, tracking, and PDF invoices.

### 2.2. Administrator

- **Description:** A team member responsible for site operations.
- **Goal:** To manage all aspects of the e-commerce platform, including product catalog, inventory, pricing rules, order fulfillment, and customer data.
- **Key Needs:** A secure and comprehensive dashboard (CMS) to manage products, pricing tiers, orders, and custom quote requests.

---

## 3. Functional Requirements

### 3.1. Platform Purchasing Modes (Core Logic)

The system must automatically apply one of two pricing models based on item quantity.

- **3.1.1. B2C (Retail Mode)**

  - [cite_start]Applies to all users purchasing quantities below the wholesale threshold[cite: 3, 4, 5].
  - [cite_start]Standard per-unit pricing is displayed and charged[cite: 5].

- **3.1.2. B2B (Wholesale Mode)**
  - [cite_start]This mode is triggered automatically for _any user_ when a product quantity meets or exceeds a set threshold[cite: 6, 7].
  - The cart and product pages must clearly and automatically update to reflect the applied discount.
  - [cite_start]**Bulk Discount Tiers:** The system must support configurable pricing tiers[cite: 8]. The initial tiers are:
    - [cite_start]**Tier 1:** 1–49 units → Base price [cite: 9]
    - [cite_start]**Tier 2:** 50–99 units → 10% off base price [cite: 10]
    - [cite_start]**Tier 3:** 100+ units → Specific wholesale price [cite: 11]

### 3.2. Core E-commerce Features

- **3.2.1. Product Catalog:**
  - [cite_start]Support for multiple product categories and nested subcategories[cite: 13].
  - **Product Listing Page (PLP):**
    - [cite_start]Products must be displayed in a grid layout[cite: 14].
    - [cite_start]Must include filtering and sorting capabilities[cite: 14].
  - **Product Detail Page (PDP):**
    - [cite_start]Must display product details, including variants like sizes[cite: 15].
    - [cite_start]**Product Gallery:** Must support multiple images per product[cite: 16].
    - [cite_start]**Variant Selector:** Must allow users to select from available variants (e.g., size, color, material, type)[cite: 17].
    - [cite_start]**Quantity Selector:** Must allow users to input or adjust the quantity[cite: 19].
  - [cite_start]**Related Products:** The PDP must display a section for "Related Products" suggestions[cite: 20].
- **3.2.2. Navigation:**
  - [cite_start]**Breadcrumbs:** Must be present to show the user's path (e.g., `Home > Category > Product`)[cite: 21].

### 3.3. Shopping Cart & Checkout

- **3.3.1. Shopping Cart:**
  - [cite_start]Must allow users to "Add to Cart"[cite: 18].
  - [cite_start]Users must be able to edit quantities or remove items from the cart[cite: 25].
  - [cite_start]**Cart Persistence:** The cart must be persistent for logged-in users (via Supabase Auth)[cite: 24].
  - [cite_start]**Price Calculation:** The cart must automatically calculate the subtotal [cite: 26][cite_start], applying B2B tiered discounts as quantities change[cite: 27].
- **3.3.2. Checkout Process:**
  - [cite_start]**Guest Checkout:** Must provide an option for customers to buy products without creating an account[cite: 32].
  - [cite_start]**Secure Checkout:** Payment processing must be handled by Stripe[cite: 28].
  - [cite_start]**Address Management:** Users must be able to enter and save (if logged in) shipping and billing addresses[cite: 29].
- **3.3.3. Order Confirmation:**
  - [cite_start]An **Order Summary Page** must be shown[cite: 30].
  - [cite_start]An **Order Confirmation Page** must be displayed after successful payment[cite: 31].
  - [cite_start]An **Order Confirmation Email** must be sent to the user[cite: 31].

### 3.4. User Account & Authentication

- **3.4.1. Authentication:**
  - [cite_start]Users must be able to register for a new account[cite: 34].
  - [cite_start]Users must be able to log in[cite: 34].
  - [cite_start]Authentication will be handled by **Supabase Auth**[cite: 34].
- **3.4.2. "My Account" Dashboard:**
  - [cite_start]Logged-in users must have access to a central dashboard[cite: 35].
  - [cite_start]**Order History:** Users must be able to view details of all past orders[cite: 36].
  - [cite_start]**Order Tracking:** Users must be able to see the status of current orders[cite: 37].
  - [cite_start]**Saved Addresses:** Users must be able to add, edit, and delete saved addresses[cite: 38].
  - [cite_start]**Invoice Download:** Users must be able to download PDF invoices for past orders[cite: 39].
  - [cite_start]**Reorder:** Users must have a simple "Reorder" button to add items from a previous order to their cart[cite: 40].

### 3.5. Content & Information Pages

The system must support the following static content pages:

- [cite_start]About Us [cite: 58]
- [cite_start]Delivery Information [cite: 59]
- [cite_start]Returns Policy [cite: 60]
- [cite_start]Privacy Policy [cite: 61]
- [cite_start]Terms & Conditions [cite: 62]
- [cite_start]Sustainability / Eco-friendly Packaging Info [cite: 63]

### 3.6. Customer Support & Communication

- [cite_start]**Contact Form:** A contact page with a form that sends emails via **Resend**[cite: 53].
- [cite_start]**Footer:** The site footer must contain the company's phone number and email address[cite: 54].
- [cite_start]**FAQ Page:** A page for frequently asked questions[cite: 55].
- [cite_start]**Delivery Tracking:** A link (manual or API-based) for users to track their delivery[cite: 56].

---

## 4. Administrator (CMS) Requirements

[cite_start]A secure admin dashboard (Custom CMS) is required for site management[cite: 42].

### 4.1. Product Management

- [cite_start]Full CRUD (Create, Read, Update, Delete) for products[cite: 43].
- [cite_start]Ability to upload and manage product images[cite: 44].
- [cite_start]Ability to create and manage product variants (size, material, color, etc.)[cite: 45].
- [cite_start]Ability to search for products by product code or name[cite: 50].

### 4.2. Pricing & Inventory Management

- [cite_start]Ability to manage inventory and stock levels for each product/variant[cite: 46].
- [cite_start]A dedicated interface to manage the wholesale tiers and pricing rules[cite: 47].

### 4.3. Order Management

- [cite_start]View and manage all incoming orders[cite: 48].
- [cite_start]Track and update order fulfillment status[cite: 48].
- [cite_start]Export order data as a CSV file[cite: 49].

### 4.4. Quote Management

- [cite_start]Ability to receive and review custom quote requests from customers[cite: 51, 75].
- [cite_start]Ability to approve or reject these quote requests[cite: 51].

---

## 5. User Workflows

### 5.1. Unified Customer Flow (Retail & Wholesale)

1.  [cite_start]A customer visits the homepage and browses categories[cite: 65].
2.  [cite_start]The customer searches or filters products and selects one[cite: 66].
3.  [cite_start]The customer chooses a variant and adds a quantity to the cart[cite: 67].
    - **Scenario A (Retail):** Customer adds 10 units. [cite_start]The cart shows the standard base price[cite: 4, 9].
    - **Scenario B (Wholesale):** Customer adds 60 units. [cite_start]The cart _automatically_ updates to show the 10% discount (Tier 2 price)[cite: 7, 10, 74].
4.  [cite_start]For very large orders, the customer may optionally request a custom quote[cite: 75].
5.  [cite_start]The customer proceeds to checkout (as guest or logged-in), enters their address, and pays via Stripe[cite: 68].
6.  [cite_start]Order confirmation is displayed on-screen and sent via email[cite: 69].
7.  [cite_start](If registered) The customer can track the order from their account dashboard[cite: 70].

### 5.2. Administrator Flow (CMS)

1.  [cite_start]The admin logs into the secure dashboard[cite: 79].
2.  [cite_start]The admin adds a new product, sets its variants, stock levels, and pricing tiers[cite: 80, 81].
3.  [cite_start]The admin reviews new orders that have come in[cite: 82].
4.  [cite_start]The admin verifies payment and updates an order's status to "Shipped"[cite: 77, 82].
5.  [cite_start]At end-of-month, the admin exports all orders as a CSV for reporting[cite: 83].

---

## 6. Non-Functional Requirements

### 6.1. Technical Stack

| Component           | Technology / Service                     |
| ------------------- | ---------------------------------------- |
| Authentication      | [cite_start]Supabase Auth [cite: 24, 34] |
| User Database       | Supabase                                 |
| Payment Processing  | [cite_start]Stripe [cite: 28]            |
| Transactional Email | [cite_start]Resend [cite: 53]            |
| Admin Backend       | [cite_start]Custom CMS [cite: 42]        |

### 6.2. Design & Accessibility

- [cite_start]The entire site must have a responsive design, ensuring it is mobile-friendly and usable on all screen sizes[cite: 22].
- The UI should be clean, modern, and provide a clear, intuitive user experience.

### 6.3. Performance

- Pages (especially the PLP and PDP) should load quickly.
- The cart and pricing calculations must be near-instant to reflect changes in quantity.
