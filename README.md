# BookMart

> A feature-rich, full-stack online bookstore built with React, PHP, and MySQL — featuring AI-powered book recommendations, real-time cart management, secure authentication, and a complete order lifecycle.

---

## 🌐 Live Demo
 
> _Run locally — see [Getting Started](#-getting-started)_
 
---

## 📸 Screenshots
 
| Main Page | Book Details | AI Assistant |
|-----------|-------------|--------------|
| _Browse curated categories_ | _Reviews, ratings & purchase_ | _Gemini-powered recommendations_ |

<div align="center">
  <img width="1470" height="907" alt="image" src="https://github.com/user-attachments/assets/6f2fe399-aed8-46df-ae52-1c0efc9c0b18" />
  <em>Main Page</em>
</div>

<div align="center">
  <img width="1470" height="907" alt="image" src="https://github.com/user-attachments/assets/8dd32089-9103-4f91-9e27-10641bb3d5bc" />
  <em>About Book Page - Book details and reviews</em>
</div>

<div align="center">
  <img width="1469" height="911" alt="localhost_5173_viewCart" src="https://github.com/user-attachments/assets/0e395fab-3cbe-49cf-b838-3d0952aeb8ef" />
  <em>View Cart Page - Display books added in carts, with options to update cart entries.</em>
</div>

<div align="center">
  <img width="1469" height="911" alt="localhost_5173_AIAssistant (4)" src="https://github.com/user-attachments/assets/13af2586-4923-47bf-9a8b-de7967d86c95" />
  <em>AI - Assistant Page </em>
</div>
 
---

## 🚀 Features
 
### 🛒 E-Commerce Core
- **Browse & Search** — Real-time search with debounced autocomplete powered by the Google Books API
- **Book Detail Pages** — Rich product pages with cover art, author info, pricing, and dynamic ratings
- **Shopping Cart** — Add, remove, and update quantities with instant optimistic UI updates
- **Checkout Flow** — Full delivery address form with order placement and confirmation
- **Order History** — View past orders with book cover enrichment via the Google Books API

### 🤖 AI-Powered Recommendations
- **Ask the AI Assistant** — Natural language book discovery powered by **Google Gemini 2.5 Flash**
- **Curated Prompt Cards** — One-click hero prompts to inspire exploration
- **Streaming Chat UI** — Animated typing indicator, user/bot message bubbles, scrollable chat history

### ⭐ Community Reviews
- **Write Reviews** — Star rating (1–5), title, and body text with form validation
- **Review Feed** — Per-book review summaries with average score, rating breakdown bars, and individual reviews
- **One Review Per User Per Book** — Enforced at both API and database level

### 🔐 Authentication & Security
- **Secure Registration & Login** — Passwords hashed with `password_hash()` (bcrypt)
- **Session-based Auth** — PHP sessions with `httponly`, `samesite: Lax` cookie flags
- **Forgot / Reset Password** — Token-based reset flow with 1-hour expiry
- **Protected Routes** — All cart, checkout, and review endpoints validate session server-side

### 📊 Global Rankings
- **Popularity Chart** — Recharts bar chart visualising top 10 books
- **Rankings List** — Top 20 books with cover art, popularity scores, and descriptions

---

## 🏗️ Architecture
 
```
bookmart/
├── backend/                 # PHP REST API
│   ├── login.php            # Auth — session creation + cart bootstrapping
│   ├── signup.php           # User registration with duplicate checking
│   ├── forgot.php / reset.php  # Token-based password reset
│   ├── add_to_cart.php      # Cart management — upserts with price calculation
│   ├── get_cart.php         # Cart retrieval with Google Books enrichment
│   ├── update_quantity.php  # Quantity updates
│   ├── remove_from_cart.php # Item removal
│   ├── checkout.php         # Order placement (transactional)
│   ├── get_order.php        # Order detail with auth check
│   ├── get_order_history.php
│   ├── add_review.php       # Review submission with validation
│   ├── get_reviews.php      # Review feed with aggregated stats
│   ├── recommend.php        # Gemini AI integration
│   ├── db.php               # MySQLi connection
│   └── schema.sql           # Full DB schema
│
├── frontend/                # React + Vite SPA
│   ├── src/
│   │   ├── pages/           # Route-level page components
│   │   ├── components/      # Reusable UI components
│   │   ├── services/        # API abstraction layer (Google Books, page data)
│   │   └── styles/          # CSS Modules — scoped per component
│   └── vite.config.js
│
└── .env                     # API keys (gitignored)
```
 
---

## 🛠️ Tech Stack
 
| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, React Router v6, Vite |
| **Styling** | CSS Modules |
| **Charts** | Recharts |
| **Icons** | react-icons |
| **Backend** | PHP 8, MySQLi |
| **Database** | MySQL |
| **External APIs** | Google Books API, Google Gemini 2.5 Flash |
| **Auth** | PHP Sessions + bcrypt |
 
---

## 🗄️ Database Schema
 
```
users          → id, username, email, password (bcrypt), reset_token, reset_expires
carts          → id, user_id, status (active | completed)
cart_items     → cart_id, google_volume_id, quantity, unit_price
orders         → id, user_id, total, delivery details, status (enum)
order_items    → order_id, google_volume_id, quantity, price
reviews        → user_id, google_volume_id, rating, title, body
                 UNIQUE KEY (user_id, google_volume_id)
```
 
Key design decisions:
- **Soft cart lifecycle** — carts transition from `active` → `completed` on checkout; a new active cart is created atomically within the same transaction
- **Price locked at add-time** — `unit_price` stored in `cart_items` so price changes don't affect existing carts
- **Referential integrity** — all tables use `ON DELETE CASCADE` foreign keys

---

## ⚙️ Getting Started
 
### Prerequisites
- PHP 8.x + Apache (XAMPP / WAMP)
- MySQL 8.x
- Node.js 18+
- A Google Books API key _(free)_
- A Gemini API key _(free tier available)_
### 1. Clone & Configure
 
```bash
git clone https://github.com/yourusername/bookmart.git
cd bookmart
```
 
Create a `.env` file in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
 
### 2. Set Up the Database
 
```sql
CREATE DATABASE bookmart;
USE bookmart;
SOURCE backend/schema.sql;
```

### 3. Configure the Backend
 
Place the `backend/` folder inside your Apache web root (e.g. `htdocs/bookmart/backend/`).
 
Update `backend/db.php` if your MySQL credentials differ from the defaults.
 
### 4. Start the Frontend
 
```bash
cd frontend
npm install
npm run dev
```
 
Visit `http://localhost:5173`
 
---

## 🔑 Key Technical Highlights
 
### Transactional Checkout
The checkout endpoint wraps order creation, order item insertion, cart completion, and new cart creation in a single MySQL transaction — ensuring no partial state is ever persisted on failure.
 
### Debounced Search with Dropdown
The search component implements a 400ms debounce on user input, deduplicates results by volume ID, and provides keyboard-accessible dropdown navigation — all without a third-party autocomplete library.
 
### AI Recommendation Engine
The PHP backend proxies requests to the Gemini API, constructs a structured prompt, strips markdown fences from the response, and returns clean JSON to the frontend — keeping the API key server-side at all times.
 
### Session Security
All sensitive endpoints check `$_SESSION['user_loggedin']` before processing. Cookies are set with `httponly: true`, `samesite: Lax`, and scoped to the correct domain to prevent CSRF and XSS token theft.
 
### Price Integrity
Book prices are derived from Google Books ratings (`rating × 5.5 + 8`) and locked at the moment an item enters the cart, so post-add price fluctuations never affect a user's in-progress order.
 
---

## 🧭 Roadmap
 
- [ ] Wishlist / saved books
- [ ] Admin dashboard (order management, user management)
- [ ] Email delivery for order confirmations and password resets
- [ ] OAuth login (Google / GitHub)
- [ ] Pagination and filtering on search results
- [ ] Real-time stock tracking

---

## 👤 Author
 
**[Krisha Gabda]**
- GitHub: [@krisha-gabda](https://github.com/krisha-gabda)
- LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/krishagabda)

---
 
## 📄 License
 
This project is open source and available under the [MIT License](LICENSE).
