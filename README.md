# Inkwell – Production-Ready Blog App

Full-stack blog platform built with **React + Node.js/Express + MongoDB**.

---

## Tech Stack

| Layer      | Tech                                      |
|------------|-------------------------------------------|
| Frontend   | React 18, React Router v6, Axios, Vite    |
| Backend    | Node.js, Express.js                       |
| Database   | MongoDB + Mongoose ODM                    |
| Auth       | JWT (jsonwebtoken) + bcrypt               |
| Security   | express-validator, express-mongo-sanitize |

---

## Project Structure

```
blog-app/
├── server/                  # Express backend
│   ├── app.js               # Entry point
│   ├── config/db.js         # MongoDB connection
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   └── Post.js
│   ├── middleware/
│   │   ├── auth.js          # JWT verification
│   │   ├── roleGuard.js     # RBAC middleware
│   │   └── validate.js      # Input validation
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── postController.js
│   │   └── adminController.js
│   └── routes/
│       ├── authRoutes.js
│       ├── postRoutes.js
│       └── adminRoutes.js
│
└── client/                  # React frontend
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx           # Router + layout
        ├── index.css         # Global styles
        ├── api/axios.js      # Axios instance + interceptors
        ├── context/AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx / .css
        │   ├── Footer.jsx
        │   ├── PostCard.jsx / .css
        │   └── PostForm.jsx / .css
        └── pages/
            ├── Home.jsx / .css        # Listing, search, filter, pagination
            ├── PostDetail.jsx / .css  # SEO slug-based URL
            ├── Login.jsx
            ├── Register.jsx
            ├── Auth.css
            ├── Dashboard.jsx / .css   # User's own posts
            ├── NewPost.jsx
            ├── EditPost.jsx
            └── AdminPanel.jsx / .css  # Stats, user management, all posts
```

---

## Setup & Run

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)

### 1. Backend

```bash
cd server
cp .env.example .env        # Edit MONGO_URI and JWT_SECRET
npm install
npm run dev                 # Runs on http://localhost:5000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev                 # Runs on http://localhost:5173
```

---

## API Endpoints

### Auth  `/api/auth`
| Method | Route       | Access  | Description         |
|--------|-------------|---------|---------------------|
| POST   | /register   | Public  | Create account      |
| POST   | /login      | Public  | Login, get JWT      |
| GET    | /me         | Private | Get current user    |

### Posts  `/api/posts`
| Method | Route       | Access         | Description              |
|--------|-------------|----------------|--------------------------|
| GET    | /           | Public         | List (paginate/filter)   |
| GET    | /mine       | Private        | Current user's posts     |
| GET    | /:slug      | Public         | Single post by SEO slug  |
| POST   | /           | Private        | Create post              |
| PUT    | /:id        | Owner or Admin | Update post              |
| DELETE | /:id        | Owner or Admin | Delete post              |

### Admin  `/api/admin` _(Admin only)_
| Method | Route              | Description           |
|--------|--------------------|-----------------------|
| GET    | /stats             | Dashboard stats       |
| GET    | /users             | All users             |
| PUT    | /users/:id/role    | Change user role      |
| DELETE | /users/:id         | Delete user           |
| GET    | /posts             | All posts             |

---

## Features

- ✅ JWT authentication with 7-day expiry
- ✅ Role-based access control (Admin / User)
- ✅ SEO-friendly slug URLs (auto-generated, unique)
- ✅ Pagination, filtering by tag, full-text search, sorting
- ✅ Input validation + MongoDB injection sanitization
- ✅ Modular MVC codebase
- ✅ Draft / Publish workflow
- ✅ Admin dashboard with stats, user & post management
- ✅ Responsive editorial UI (Playfair Display + DM Sans)

---

## Making Yourself Admin

After registering, open a MongoDB shell or Compass and run:

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```
