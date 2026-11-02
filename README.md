# 🥐 Bakery Product Management System (The Golden Crust)

**A Full-Stack MEAN Stack Web Application**  
*Third-Year Computer Engineering Academic Project*

---

## 1. Project Introduction

The **Bakery Product Management System** is a web-based e-commerce and inventory management application designed specifically for bakeries, pastry shops, and cafes. It provides bakery owners and administrators with complete digital control over their catalog, categories, pricing, stock levels, registered customers, and incoming orders. Concurrently, customers enjoy a warm, intuitive online ordering experience where they can browse freshly baked goods, filter by category, manage their shopping cart, and place orders with real-time stock verification.

Designed to mirror an exemplary third-year Computer Engineering student capstone project, this application balances modern clean aesthetics with robust software engineering practices, role-based security, relational data referencing in MongoDB, and reactive frontend state management.

---

## 2. Project Objectives

- **Centralized Bakery Management:** Provide bakery administrators with an operational dashboard to track stock in real time, add/edit/delete products, manage categories, and update order statuses.
- **Seamless Customer Experience:** Enable customers to register, log in, browse bakery delicacies in Indian Rupees (₹), add items to an interactive cart, and check out with doorstep delivery details.
- **Data Integrity & Stock Control:** Automatically decrement product stock when orders are confirmed and prevent users from purchasing quantities exceeding physical inventory.
- **Role-Based Security:** Protect administrative capabilities using JSON Web Tokens (JWT) and Bcrypt password encryption, preventing unauthorized access by guests or standard customers.
- **Academic Rigor & Clean Code:** Keep code organized, modular, readable, and free of artificial abstractions or dummy placeholders.

---

## 3. Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Database** | **MongoDB** & **Mongoose** | 8.x | Document-oriented database with structured schemas |
| **Backend** | **Node.js** & **Express.js** | 24.x / 4.21 | RESTful API server, middleware, auth routing |
| **Frontend** | **Angular** | 18.x | Client SPA with Standalone Components & RxJS |
| **Styling** | **HTML5, CSS3, Bootstrap 5** | 5.3.3 | Responsive bakery-themed UI (Cream & Chocolate palette) |
| **Icons** | **Bootstrap Icons** | 1.11.3 | Scalable vector icons |
| **Security** | **JWT & Bcrypt.js** | 9.0 / 2.4 | Token-based stateless authentication & salted password hashing |
| **File Upload** | **Multer** | 1.4.5 | Multipart file handling for bakery product pictures |

---

## 4. Website Design & Color Scheme

The user interface uses an artisanal bakery palette:
- **Cream & Soft Warm White (`#FAF3EB`, `#FFFDF9`):** Backgrounds and card canvases.
- **Chocolate Brown (`#4A2E18`, `#331F0F`):** Headers, navigation, buttons, and prominent accents.
- **Light Brown & Caramel (`#C68B59`, `#8D5B4C`):** Subheadings, dividers, and badges.
- **Soft Orange & Terracotta (`#E07A5F`, `#CC694F`):** Call-to-action buttons, badges, and highlights.
- **Golden Crust Yellow (`#E9C46A`):** Ratings, accents, and student project badges.

---

## 5. Website Modules & Features

### A. Customer Features
1. **Home Page:**
   - Hero banner with appetizing bakery imagery and action buttons.
   - Core value highlights (baked daily, 100% butter, quick delivery).
   - Popular bakery category navigation.
   - Chef's Special featured products with direct "Add to Cart".
   - Bakery heritage story and customer testimonials.
2. **Products Page:**
   - Complete bakery catalog with real-time stock badges.
   - Dynamic search by product name and description.
   - Category filtering pills and dropdown.
   - Sorting by Price (Low to High, High to Low), Newest, and Name (A-Z).
   - Stock availability indicators ("In Stock (12)", "Low Stock (4)", "Out of Stock").
3. **Product Details:**
   - Detailed product view, ingredients, unit type, and pricing in INR (₹).
   - Quantity selector bounded by available stock.
4. **Interactive Shopping Cart:**
   - Real-time total calculation with automatic GST breakdown.
   - Increment, decrement, and removal of cart items.
   - Free delivery threshold calculation (Orders over ₹499 qualify for Free Shipping).
   - LocalStorage persistence across page reloads.
5. **Checkout & Order Placement:**
   - Customer shipping address capture (Full name, phone, address, city, pincode).
   - Payment method selection: "Cash on Delivery" or "UPI / Online Payment (Demo)".
   - Custom bakery order notes (e.g. cake messages, delivery timing).
   - Inventory stock auto-decrement in MongoDB upon successful order.
6. **Order History ("My Orders"):**
   - Displays all previous customer orders with date, total, item list, and delivery address.
   - Status indicators: `Pending`, `Confirmed`, `Processing`, `Delivered`, `Cancelled`.
7. **Customer Profile:**
   - View and update personal information and default delivery address.

### B. Admin Features
1. **Admin Authentication Portal:**
   - Separate, dedicated login page for administrators (`/admin-login`).
   - Guarded by `admin.guard.ts` on the frontend and `adminMiddleware.js` on the backend.
   - Default credentials pre-fill helper for academic evaluators.
2. **Admin Operations Dashboard:**
   - Metric cards: **Total Products**, **Total Orders**, **Total Customers**, and **Low Stock Alerts**.
   - Total sales revenue calculation from non-cancelled orders.
   - Low stock warning list for items with &le; 5 units remaining.
   - Recent orders preview table with quick status management.
3. **Product Management (Full CRUD):**
   - **Create:** Add new bakery items with category, price in ₹, stock count, unit, description, featured toggle, and image upload.
   - **Read:** Comprehensive product table with search filter and thumbnail previews.
   - **Update:** Modify product pricing, descriptions, stock quantities, and images.
   - **Delete:** Remove products with confirmation.
4. **Category Management:**
   - Add, edit, view, and delete bakery categories (e.g., Cakes, Pastries, Bread, Cookies, Donuts, Cupcakes, Brownies).
   - Deletion protection prevents deleting categories that still have assigned products.
5. **Order Management:**
   - View all customer orders with customer details and purchased items.
   - Status update dropdown: change status directly to `Pending`, `Confirmed`, `Processing`, `Delivered`, or `Cancelled`.
   - Automatic inventory restoration if an order is marked as `Cancelled`.

---

## 6. Project Folder Structure

```
bakery-management-system/
│
├── frontend/                                # Angular 18 Single Page Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── navbar/                  # Responsive Dynamic Navbar
│   │   │   │   ├── footer/                  # Bakery Footer with Student Badge
│   │   │   │   ├── home/                    # Home Landing Page
│   │   │   │   ├── products/                # Catalog with Search & Filter
│   │   │   │   ├── product-detail/          # Single Product Details
│   │   │   │   ├── cart/                    # Shopping Cart
│   │   │   │   ├── checkout/                # Checkout & Order Placement
│   │   │   │   ├── my-orders/               # Customer Order Tracking
│   │   │   │   ├── profile/                 # Customer Profile Management
│   │   │   │   ├── register/                # Customer Registration
│   │   │   │   ├── login/                   # Customer Login
│   │   │   │   ├── admin-login/             # Dedicated Admin Portal
│   │   │   │   └── admin/                   # Admin Operations Module
│   │   │   │       ├── admin-dashboard/     # Stats & Operational Metrics
│   │   │   │       ├── admin-products/      # Product CRUD Management
│   │   │   │       ├── admin-categories/    # Category CRUD Management
│   │   │   │       └── admin-orders/        # Order Fulfillment Management
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts          # Auth state, JWT & localStorage
│   │   │   │   ├── product.service.ts       # Products API Service
│   │   │   │   ├── category.service.ts      # Categories API Service
│   │   │   │   ├── cart.service.ts          # Shopping Cart BehaviorSubject
│   │   │   │   ├── order.service.ts         # Orders API Service
│   │   │   │   └── dashboard.service.ts     # Admin Metrics API Service
│   │   │   ├── models/                      # TypeScript Interfaces
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── category.model.ts
│   │   │   │   ├── product.model.ts
│   │   │   │   ├── order.model.ts
│   │   │   │   ├── cart.model.ts
│   │   │   │   └── dashboard.model.ts
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts            # Protects Customer Routes
│   │   │   │   └── admin.guard.ts           # Protects Admin Routes
│   │   │   ├── app.component.ts             # Shell Component
│   │   │   ├── app.config.ts                # Application Providers & HttpClient
│   │   │   └── app.routes.ts                # Route Definitions
│   │   ├── index.html                       # HTML Document Root
│   │   └── styles.css                       # Global Theme & Bootstrap Styling
│   ├── components/                          # Convenience Module Re-exports
│   ├── services/                            # Convenience Service Re-exports
│   ├── models/                              # Convenience Model Re-exports
│   ├── guards/                              # Convenience Guard Re-exports
│   ├── angular.json
│   └── package.json
│
├── backend/                                 # Node.js & Express REST Backend
│   ├── config/
│   │   ├── db.js                            # MongoDB Mongoose Connection
│   │   └── seed.js                          # Database Seeder (Admin, Products, Orders)
│   ├── controllers/
│   │   ├── authController.js                # Register, Login, Admin Login, Profile
│   │   ├── productController.js             # Products CRUD & Image Handling
│   │   ├── categoryController.js            # Category CRUD Operations
│   │   ├── orderController.js               # Order Placement, History, Status Update
│   │   └── dashboardController.js           # Inventory & Financial Statistics
│   ├── middleware/
│   │   ├── authMiddleware.js                # JWT Bearer Token Validation
│   │   ├── adminMiddleware.js               # Admin Role Authorization
│   │   └── uploadMiddleware.js              # Multer File Upload Configuration
│   ├── models/
│   │   ├── User.js                          # Customer & Admin Schema
│   │   ├── Category.js                      # Bakery Category Schema
│   │   ├── Product.js                       # Bakery Product Schema (Prices in ₹)
│   │   └── Order.js                         # Customer Order Schema
│   ├── routes/
│   │   ├── authRoutes.js                    # /api/auth
│   │   ├── categoryRoutes.js                # /api/categories
│   │   ├── productRoutes.js                 # /api/products
│   │   ├── orderRoutes.js                   # /api/orders
│   │   └── dashboardRoutes.js               # /api/dashboard
│   ├── uploads/                             # Uploaded Product Images Storage
│   ├── verify-all.js                        # Automated 18-Step Test Suite
│   ├── .env                                 # Environment Variables
│   ├── package.json
│   └── server.js                            # Express Server & Static File Hosting
│
└── README.md                                # Comprehensive Project Documentation
```

---

## 7. MongoDB Database Structure

### Collections & Schemas:
1. **Users (`User.js`):**
   - `name`: String (Required)
   - `email`: String (Required, Unique, Lowercase)
   - `phone`: String (Required)
   - `password`: String (Required, Hashed with Bcrypt)
   - `role`: Enum `['customer', 'admin']` (Default: `'customer'`)
   - `address`: `{ street, city, state, pincode }`
   - `timestamps`: Created & Updated dates

2. **Categories (`Category.js`):**
   - `name`: String (Required, Unique)
   - `description`: String
   - `imageUrl`: String

3. **Products (`Product.js`):**
   - `name`: String (Required)
   - `category`: ObjectId ref `'Category'` (Required)
   - `price`: Number (Required, Min: 0, in INR ₹)
   - `description`: String (Required)
   - `stock`: Number (Required, Min: 0)
   - `imageUrl`: String (Required)
   - `unit`: Enum `['piece', 'kg', 'box', 'pack', 'slice']`
   - `isFeatured`: Boolean (Default: `false`)

4. **Orders (`Order.js`):**
   - `customer`: ObjectId ref `'User'` (Required)
   - `items`: `[{ product, name, price, quantity, imageUrl }]`
   - `totalAmount`: Number (Required)
   - `shippingAddress`: `{ fullName, phone, address, city, pincode }`
   - `paymentMethod`: Enum `['Cash on Delivery', 'UPI / Online Payment']`
   - `orderStatus`: Enum `['Pending', 'Confirmed', 'Processing', 'Delivered', 'Cancelled']`
   - `orderNotes`: String

---

## 8. Installation & Setup Instructions

### Prerequisites:
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local Community Server installed and running on port `27017`)
- **npm** (v9 or higher)

### Step 1: Clone or Navigate to the Project Directory
```powershell
cd C:\Users\user\.gemini\antigravity\scratch\bakery-management-system
```

### Step 2: Backend Setup
```powershell
cd backend
npm install
```

Configure environment variables in `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bakery_management_db
JWT_SECRET=bakery_secret_jwt_key_academic_project_2026
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:4200
```

### Step 3: Seed Database (Admin, Categories, Products & Demo Orders)
Run the automated seed script to populate realistic Indian bakery items:
```powershell
npm run seed
```
This initializes:
- **Admin Account:** `admin@bakery.com` / `admin123`
- **Customer Account:** `rahul@bakery.com` / `customer123`
- **7 Categories:** Cakes, Pastries, Bread, Cookies, Donuts, Cupcakes, Brownies
- **10 Realistic Products:** Chocolate Cake, Black Forest Cake, Strawberry Cake, Vanilla Pastry, Chocolate Donut, Fresh Bread Loaf, Chocolate Chip Cookies, Velvet Cupcakes, Fudge Brownies, Chocolate Muffins.
- **Initial Sample Orders** for dashboard reporting.

### Step 4: Frontend Setup
```powershell
cd ../frontend
npm install
```

---

## 9. Commands to Run the Application

### Option A: Independent Mode (Recommended for Development)

1. **Start Backend Server:**
   ```powershell
   cd backend
   npm run dev
   # Server runs on http://localhost:5000
   ```

2. **Start Angular Dev Server:**
   ```powershell
   cd frontend
   npm start
   # Angular app runs on http://localhost:4200
   ```
   Open **http://localhost:4200** in your browser.

---

### Option B: Unified Full-Stack Mode (Single Command)

The Express backend is configured to automatically serve the compiled Angular production build:
```powershell
# 1. Build frontend
cd frontend
npm run build

# 2. Start backend
cd ../backend
node server.js
```
Open **http://localhost:5000** in your web browser. The complete application, including Angular views and REST APIs, runs on a single port!

---

## 10. Automated Verification & Testing

To run the built-in end-to-end automated test suite:
```powershell
cd backend
node verify-all.js
```
### Verified Test Results (18/18 Tests Passed):
- [x] 1. System Health Check Endpoint
- [x] 2. Fetch All Bakery Categories
- [x] 3. Fetch All Bakery Products from MongoDB
- [x] 4. Customer Registration API with bcrypt hashing
- [x] 5. Duplicate Email Registration Prevention
- [x] 6. Customer JWT Login Verification
- [x] 7. Admin Authentication with Secure Role Verification
- [x] 8. Role-Based Access Control (Customer blocked from admin routes)
- [x] 9. Admin Dashboard Statistics Calculation (Total Products, Orders, Customers, Low Stock)
- [x] 10. Product CRUD: Admin Create Product in MongoDB
- [x] 11. Product CRUD: Admin Update Price & Stock
- [x] 12. Category CRUD: Admin Create Category
- [x] 13. Category CRUD: Admin Delete Category
- [x] 14. Customer Order Placement & Checkout
- [x] 15. MongoDB Inventory Auto-Decrement upon Order Placement
- [x] 16. Customer My Orders History Retrieval
- [x] 17. Admin Order Fulfillment Status Update (Pending -> Processing)
- [x] 18. Product CRUD: Admin Delete Product from MongoDB

---

## 11. Default Demonstration Accounts

| Role | Email | Password | Access Privileges |
|---|---|---|---|
| **Administrator** | `admin@bakery.com` | `admin123` | Dashboard, Product CRUD, Categories, All Orders |
| **Customer** | `rahul@bakery.com` | `customer123` | Home, Menu, Cart, Checkout, Order Tracking |

*(Both login portals also provide an **"Auto-fill"** button to streamline project demonstrations).*

---

## 12. Academic Project Declaration

- **Course:** B.E. / B.Tech Computer Engineering (Third Year)
- **Subject:** Web Technology & Full-Stack Development Laboratory
- **Stack:** MongoDB, Express.js, Angular, Node.js (MEAN)
- **Status:** Complete, Functional, Fully Tested & Verified.
