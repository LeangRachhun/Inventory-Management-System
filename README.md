# 📦 Inventory Management System (MERN + Docker)

A full-stack **Inventory Management System** built with the **MERN stack (MongoDB, Express, React, Node.js)**.  
The project helps manage products, track inventory data, and visualize statistics through charts.

The application is containerized using **Docker** for easier setup and deployment.

---

# 🚀 Tech Stack

## Frontend
- React 19
- Vite
- TypeScript
- TailwindCSS
- React Router
- Axios
- React ChartJS 2
- React Data Table Component
- SweetAlert2
- React Icons

## Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt (password hashing)
- Morgan (logging)
- CORS
- dotenv

## Dev Tools
- Docker
- Nodemon
- ESLint
- TypeScript

---

# 📊 Features

- 🔐 User authentication with JWT
- 📦 Product inventory management
- ➕ Add / update / delete products
- 📋 Data table view for inventory
- 📈 Charts & analytics dashboard
- 🔎 Search and filtering
- 📡 REST API backend
- 🐳 Docker container support

---

# 🏗️ Project Structure

```bash
inventory-management-system
│
├── client # Frontend (React + Vite)
│ ├── public
│ ├── src
│ │ ├── components
│ │ ├── context
│ │ ├── pages
│ │ ├── types
│ │ ├── utils
│ └── package.json
│ └── index.html
│
├── server # Backend (Node + Express)
│ ├── src
│ │ ├── config
│ │ ├── controllers
│ │ ├── middlewares
│ │ ├── models
│ │ ├── routes
│ │ ├── types
│ │ ├── utils
│ │ ├── seed.ts
│ │ └── index.ts
│ └── package.json
│ └── .env
│
├── docker-compose.yml
└── README.md
```

# 🔑 Environment Variables

Create .env file in the server folder.

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/inventoryDB
JWT_SECRET=your_secret_key
```

#📡 API Example

Example API endpoint:

```bash
GET /api/products
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
```
