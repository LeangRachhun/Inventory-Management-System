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

inventory-management-system
│
├── client # Frontend (React + Vite)
│ ├── src
│ ├── public
│ └── package.json
│
├── server # Backend (Node + Express)
│ ├── src
│ │ ├── controllers
│ │ ├── models
│ │ ├── routes
│ │ └── index.ts
│ └── package.json
│
├── docker-compose.yml
└── README.md
