# 🍕 PizzaHub Client

**A Modern Artisan Pizza Ordering & Multi-Vendor Marketplace**

PizzaHub is a modern, full-stack pizza ordering and delivery platform that connects customers with local pizzerias and restaurant vendors. Built with **Next.js 16, React 19, TypeScript, and Tailwind CSS**, the platform delivers a seamless food ordering experience with dedicated dashboards for Customers, Vendors, and Admins.

From discovering artisan pizzas to managing restaurant operations, tracking orders, and handling vendor subscriptions, PizzaHub provides a complete multi-vendor marketplace experience.

---

## 🌐 Live Application

| Service | Live Link |
|---|---|
| Frontend Application | [PizzaHub Client](https://pizzahub-client-2wd4.vercel.app) |
| Backend API | [PizzaHub Server](https://pizzahub-client-nkpu.vercel.app) |

## 🔑 Demo Login Credentials

Use the following demo accounts to explore PizzaHub's role-based dashboards and functionalities.

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@pizzahub.com` | `Admin1234!` |
| **Vendor** | `vendor@pizzahub.com` | `Vendor1234` |

### Demo Account Access

- **Admin:** Access the Admin Dashboard to manage users, review menu items, and monitor platform activities.
- **Vendor:** Access the Vendor Dashboard to manage menu items, handle customer orders, and explore subscription features.

**Note:** These credentials are provided for demonstration and evaluation purposes only. Please do not use them for personal or production accounts.

Google Sign-In is also available where configured.

## 📂 GitHub Repositories

| Repository | Link |
|---|---|
| Frontend Repository | [pizzahub-client](https://github.com/mahim157/pizzahub-client) |
| Backend Repository | [pizzahub-server](https://github.com/mahim157/pizzahub-server) |

---

## ✨ Key Features

### 🛒 Customer Experience

- **Smart Menu Discovery:** Browse approved pizza items with search, category filtering, location filtering, and price sorting.
- **Interactive Pizza Details:** Explore pizza descriptions, images, restaurant information, and pricing.
- **Ratings & Reviews:** Submit ratings and reviews for pizza items.
- **Personal Wishlist:** Save favorite pizzas for convenient access.
- **Order Management:** Place orders with delivery date, address, and special instructions.
- **Order Tracking:** Follow order progress through status updates.
- **Order Cancellation:** Cancel eligible pending orders.
- **Profile Management:** Update personal information and profile images.

### 👨‍🍳 Vendor Dashboard

- **Dashboard Analytics:** Monitor menu items, customer orders, and subscription information.
- **Menu Management:** Create, update, delete, and manage pizza menu items.
- **Image Upload:** Upload pizza images using ImgBB integration.
- **Order Management:** View incoming orders and accept or reject pending requests.
- **Premium Subscription:** Upgrade to a Premium plan through Stripe Checkout.
- **Restaurant Profile:** Manage restaurant information and business details.
- **Menu Approval:** Track menu item approval and publication status.

### 🛡️ Admin Dashboard

- **Platform Overview:** Monitor registered users, vendors, customers, menu items, and transactions.
- **User Management:** View, search, block, and unblock registered users.
- **Menu Moderation:** Review submitted menu items and approve or reject them.
- **Menu Management:** Manage published menu items.
- **Transaction Monitoring:** View subscription payment records.
- **Admin Profile:** Manage administrator profile information.

### 🎨 UI/UX & Additional Features

- Responsive layouts for mobile, tablet, and desktop.
- Modern pizza-themed interface.
- Dark and light theme support.
- Reusable UI components.
- Smooth animations using Motion.
- Interactive navigation and role-based dashboards.
- Loading, empty, success, and error states.
- Toast notifications for user feedback.

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Programming Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | ShadCN UI |
| Icons | Lucide React |
| Authentication | Better Auth |
| Authorization | JWT & Role-Based Access |
| Animations | Motion |
| Payment Integration | Stripe Checkout |
| Image Hosting | ImgBB |
| Deployment | Vercel |
| Version Control | Git & GitHub |

---

## 👥 User Roles

PizzaHub provides three dedicated user experiences.

| Role | Main Responsibilities |
|---|---|
| Customer | Browse pizzas, manage favorites, place orders, and track deliveries |
| Vendor | Manage restaurant menus, handle customer orders, and manage subscriptions |
| Admin | Manage users, moderate menu items, and monitor platform transactions |

Each role has access to its own dashboard and authorized features.

---

## 📁 Project Architecture

The frontend follows the Next.js App Router architecture with reusable components and organized application logic.

```text
client/
│
├── app/
│   ├── dashboard/
│   │   ├── admin/
│   │   │   ├── users/
│   │   │   ├── menu-approvals/
│   │   │   └── profile/
│   │   │
│   │   ├── customer/
│   │   │   ├── my-orders/
│   │   │   ├── favorites/
│   │   │   └── profile/
│   │   │
│   │   ├── vendor/
│   │   │   ├── add-item/
│   │   │   ├── my-menu/
│   │   │   ├── orders/
│   │   │   ├── subscription/
│   │   │   └── profile/
│   │   │
│   │   └── layout.tsx
│   │
│   ├── login/
│   ├── register/
│   ├── menu/
│   │   └── [id]/
│   │
│   ├── payment/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── ui/
│   ├── Navbar/
│   └── Footer/
│
├── lib/
│   ├── auth-client.ts
│   └── API utilities
│
├── public/
│   └── Static assets and images
│
├── package.json
├── tsconfig.json
└── README.md
```

*Note: The architecture above illustrates the main application structure. Some folders and filenames may vary according to the actual implementation.*

---

## 🔐 Authentication & Authorization

PizzaHub uses Better Auth for authentication and JWT-based authorization.

Authentication features include:

- Email and password login.
- User registration.
- Google authentication.
- Session management.
- Role-based navigation.
- Protected dashboard access.
- JWT-based communication with the backend.

Users are redirected to the appropriate dashboard according to their assigned role.

Authorization is also verified by the backend to prevent unauthorized access to protected resources.

---

## 💳 Payment Integration

PizzaHub integrates Stripe Checkout for Vendor Premium subscriptions.

### Subscription Workflow

1. Vendor selects the Premium subscription plan.
2. Frontend requests a subscription session from the backend.
3. Vendor is redirected to Stripe Checkout.
4. Stripe processes the payment.
5. Backend verifies the payment through Stripe webhooks.
6. The subscription is activated after successful verification.

**Important:** Stripe is used only for Vendor Premium subscriptions. Customer pizza ordering does not require Stripe payment integration.

---

## 🖼️ Image Management

ImgBB is integrated for menu item image uploads.

Vendors can upload pizza images through the protected backend API. The frontend handles the image selection and upload workflow and displays the hosted images in the menu and dashboard.

---

## 🚀 Getting Started

Follow these instructions to run the frontend locally.

### 1. Clone the Repository

```bash
git clone https://github.com/mahim157/pizzahub-client.git
```

### 2. Navigate to the Project Directory

```bash
cd pizzahub-client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory.

Configure the following variable:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Note:** Update the API URL according to your backend deployment environment. Add any additional environment variables required by your actual implementation.

### 5. Start the Development Server

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

### 6. Build for Production

```bash
npm run build
```

To start the production server after building:

```bash
npm run start
```

---

## ⚙️ Environment Configuration

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

Additional authentication or integration variables should be configured according to the application's actual environment setup.

**Security:** Never commit `.env.local` or other files containing private credentials to GitHub.

---

## 🎯 Assignment Challenge Implementation

### 1. Advanced Search & Sorting

- Search menu items by name.
- Filter items by category and location.
- Sort menu items by price in ascending order.
- Sort menu items by price in descending order.

### 2. JWT / Token Verification

- Better Auth authentication integration.
- JWT-based authenticated API requests.
- Protected frontend routes.
- Role-based dashboard navigation.
- Backend-side authorization verification.

### 3. Professional UI/UX

- Modern artisan pizza marketplace design.
- Responsive layouts.
- Reusable components.
- Consistent typography and spacing.
- Smooth animations and interactive elements.

---

## 🌟 Additional Features

PizzaHub includes additional features that enhance the user experience:

- ⭐ Menu item ratings and reviews.
- ❤️ Customer favorites and wishlist.
- 🌗 Dark and light mode.
- 📦 Order status tracking.
- 📊 Role-based dashboard analytics.

---

## 📱 Responsive Design

The application is designed to provide a consistent experience across:

- Desktop computers.
- Tablets.
- Mobile devices.

Navigation, menu cards, dashboards, and forms adapt to different screen sizes.

---

## 🔗 Related Resources

- **Frontend Live:** [PizzaHub Client](https://pizzahub-client-2wd4.vercel.app)
- **Backend Live:** [PizzaHub API](https://pizzahub-client-nkpu.vercel.app)
- **Frontend GitHub:** [mahim157/pizzahub-client](https://github.com/mahim157/pizzahub-client)
- **Backend GitHub:** [mahim157/pizzahub-server](https://github.com/mahim157/pizzahub-server)

---

## 📄 License

This project was developed for academic purposes as part of Assignment 9.

---

<div align="center">

**🍕 PizzaHub**

*Bringing Local Pizzerias and Pizza Lovers Together.*

Developed with ❤️ using Next.js, React, TypeScript, and MongoDB.

</div>