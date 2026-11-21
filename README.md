<div align="center">

# 🍕 PizzaHub — Artisan Pizza Ordering & Multi-Vendor Marketplace

**A modern, full-stack artisan pizza marketplace connecting pizza enthusiasts with local pizzerias and kitchen vendors.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-007ACC?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-626CD9?style=for-the-badge&logo=stripe)](https://stripe.com/)

[Live Demo](#) · [Report Bug](https://github.com/mahim157/pizzahub-client/issues) · [Backend Repository](https://github.com/mahim157/pizzahub-server)

</div>

---

## 📖 Overview

**PizzaHub** is an end-to-end food ordering and kitchen management platform built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**. It delivers tailored, role-based dashboards for **Customers**, **Vendors**, and **Admins**—featuring real-time order tracking, verified customer ratings & reviews, wishlist management, Stripe vendor subscriptions, and administrative moderation tools.

---

## ✨ Key Features

### 🛒 Customer Experience
- **Smart Menu Discovery:** Browse approved artisan pizzas with real-time search, category filtering, and price sorting.
- **Interactive Pizza Details & Reviews (`/menu/[id]`):** Explore ingredients, restaurant info, average ratings, and submit verified `1–5 star` reviews.
- **Personal Wishlist (`/dashboard/customer/favorites`):** Save favorite pizzas to a dedicated wishlist for instant reordering.
- **Live Order Progress Tracker (`/dashboard/customer/my-orders`):** Track order statuses step-by-step (`Pending` → `Preparing` → `Out for Delivery` → `Delivered`).
- **Profile Management (`/dashboard/customer/profile`):** Update personal details and avatar image seamlessly.

### 👨‍🍳 Vendor / Kitchen Dashboard
- **Kitchen Analytics (`/dashboard/vendor`):** Monitor menu performance, incoming orders, and total earnings at a glance.
- **Menu Builder & Management (`/dashboard/vendor/add-item` & `/my-menu`):** Add, edit, and manage pizza items with integrated **ImgBB** cloud image uploads.
- **Order Fulfillment (`/dashboard/vendor/orders`):** Update incoming customer order statuses in real time.
- **Premium Kitchen Subscription (`/dashboard/vendor/subscription`):** Upgrade to a **Premium Plan** via **Stripe Checkout** for priority visibility.
- **Vendor Profile Settings (`/dashboard/vendor/profile`):** Customize restaurant/business name, manager info, and kitchen branding.

### 🛡️ Admin Command Center
- **Platform Snapshot (`/dashboard/admin`):** Real-time insights into registered users, active vendors, and catalog health.
- **Menu Moderation Queue (`/dashboard/admin/menu-approvals`):** Review, approve, or reject newly submitted vendor pizzas before public listing.
- **User & Role Governance (`/dashboard/admin/users`):** Manage user roles (`Customer`, `Vendor`, `Admin`) and account statuses.
- **Admin Profile & CSV Reporting (`/dashboard/admin/profile`):** Update admin credentials and export full platform menu reports as `.csv`.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **UI Library** | React 19, Lucide Icons |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 (Dark/Light Theme Support) |
| **Authentication** | Better Auth Client (Session & JWT Bearer Support) |
| **Payments** | Stripe Checkout Integration |
| **Image Hosting** | ImgBB API Integration |

---

## 📁 Project Architecture

```text
client/
├── app/
│   ├── dashboard/
│   │   ├── admin/               # Platform analytics, menu approvals, user management & profile
│   │   ├── customer/            # Customer overview, order tracking, wishlist & profile
│   │   ├── vendor/              # Kitchen overview, add-item, my-menu, orders, subscription & profile
│   │   └── layout.tsx           # Role-based responsive dashboard sidebar & navigation shell
│   ├── login/                   # Authentication login view
│   ├── register/                # Customer & Vendor onboarding view
│   ├── menu/                    # Public menu catalog & dynamic pizza details (/menu/[id])
│   ├── payment/                 # Stripe checkout success & cancellation views
│   ├── layout.tsx               # Root layout & global providers
│   └── page.tsx                 # High-converting landing page
├── components/                  # Reusable UI components & Navbar/Footer
├── lib/                         # API fetch utilities & Better Auth client configuration
└── public/                      # Static assets & brand media