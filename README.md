# 🛍️ AB Fashion

A modern full-stack fashion e-commerce platform built with **React, Vite, Node.js, Express, and MongoDB**.

AB Fashion provides a modern shopping experience with product browsing, authentication, product management, and a responsive interface enhanced with interactive **Three.js** visuals.

## 🌐 Live Demo

**Frontend:**

- **Vercel:** https://project1-eight-gold.vercel.app/

**Backend API:**
https://project-backend-2urv.onrender.com

---

## ✨ Features

### 🛒 Shopping Experience

* Browse fashion products
* Featured products section
* Product statistics
* Responsive product interface
* Modern fashion-focused UI
* Interactive 3D elements
* Product loading and error handling

### 🔐 Authentication

* User registration
* User login
* Authentication status checking
* Session-based authentication
* Secure password handling through the backend

### 📊 Backend

* RESTful API
* MongoDB database
* Product management
* Authentication endpoints
* Statistics endpoints
* CORS configuration
* Environment-based configuration

### 🎨 Frontend

* React 19
* Vite
* React Router
* Axios
* Three.js
* React Three Fiber
* React Three Drei
* Responsive UI

---

## 🧰 Tech Stack

### Frontend

| Technology        | Purpose                        |
| ----------------- | ------------------------------ |
| React             | User interface                 |
| Vite              | Frontend build tool            |
| React Router      | Client-side routing            |
| Axios             | API requests                   |
| Three.js          | 3D graphics                    |
| React Three Fiber | React integration for Three.js |
| React Three Drei  | Three.js helpers               |

### Backend

| Technology | Purpose                   |
| ---------- | ------------------------- |
| Node.js    | JavaScript runtime        |
| Express.js | Backend framework         |
| MongoDB    | Database                  |
| Mongoose   | MongoDB object modeling   |
| CORS       | Cross-origin requests     |
| dotenv     | Environment configuration |

### Deployment

| Service       | Usage               |
| ------------- | ------------------- |
| Vercel        | Frontend deployment |
| Render        | Backend deployment  |
| MongoDB Atlas | Cloud database      |

---

# 📁 Project Structure

```text
Project/
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

> Folder names may vary depending on the current project structure.

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/newuser200500-eng/Project.git
```

Move into the project:

```bash
cd Project
```

---

# 💻 Frontend Setup

Move into the frontend directory:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# ⚙️ Backend Setup

Open another terminal and move into the backend:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
PORT=5000
```

Start the backend:

```bash
npm start
```

The API will normally run at:

```text
http://localhost:5000
```

---

# 🔑 Environment Variables

## Frontend

The frontend requires:

```env
VITE_API_URL=http://localhost:5000
```

For production:

```env
VITE_API_URL=https://project-backend-2urv.onrender.com
```

## Backend

The backend requires:

```env
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret
PORT=5000
```

### ⚠️ Security

Never commit your `.env` file to GitHub.

Make sure `.gitignore` contains:

```gitignore
.env
.env.local
.env.production
node_modules/
dist/
```

Never expose:

* MongoDB passwords
* Session secrets
* API keys
* Private credentials

---

# 🗄️ MongoDB Setup

AB Fashion uses **MongoDB Atlas** as its cloud database.

1. Create a MongoDB Atlas account.
2. Create a cluster.
3. Create a database user.
4. Configure Network Access.
5. Copy the MongoDB connection string.
6. Add the connection string to your backend `.env`.

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/SHOP
```

For production, use appropriate network restrictions instead of permanently allowing all IP addresses.

---

# 🔌 API

The backend provides REST API endpoints for the frontend.

### Authentication

```text
POST /auth/register
POST /auth/login
GET  /auth/status
POST /auth/logout
```

### Products

```text
GET    /products
GET    /products/:id
POST   /products
PUT    /products/:id
DELETE /products/:id
```

### Statistics

```text
GET /stats
```

> Exact endpoints may vary depending on the backend implementation.

---

# 🌍 Deployment

## Frontend — Vercel

The frontend is deployed using Vercel.

### Build settings

```text
Framework: Vite
Root Directory: Frontend
Build Command: npm run build
Output Directory: dist
Install Command: Automatic
```

Production environment variable:

```env
VITE_API_URL=https://project-backend-2urv.onrender.com
```

---

## Backend — Render

The backend is deployed using Render.

### Start command

```bash
npm start
```

The backend uses Render's provided `PORT` environment variable.

Example:

```js
const PORT = process.env.PORT || 5000;
```

Add the following environment variables to Render:

```env
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
```

---

# 🔐 CORS Configuration

Because the frontend and backend are hosted on different domains, the backend must allow requests from the frontend.

Example:

```js
const cors = require("cors");

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://project1-eight-gold.vercel.app"
  ],
  credentials: true
}));
```

Make sure the CORS middleware is registered before your API routes.

---

# 🧪 Development

Run the frontend:

```bash
cd Frontend
npm run dev
```

Run the backend:

```bash
cd Backend
npm start
```

Build the frontend for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

# 🛠️ Troubleshooting

## Products are not loading

Check:

1. `VITE_API_URL`
2. Backend deployment status
3. MongoDB connection
4. CORS configuration
5. Browser console
6. Render logs

## CORS error

Make sure the Vercel domain is included in the backend CORS configuration:

```text
https://project1-eight-gold.vercel.app
```

## MongoDB connection error

Check:

* `MONGO_URI`
* MongoDB username
* MongoDB password
* MongoDB Atlas Network Access
* Database user permissions

## Frontend works locally but not on Vercel

Check the Vercel environment variable:

```env
VITE_API_URL=https://project-backend-2urv.onrender.com
```

After changing environment variables, redeploy the frontend.

---

# 📸 Screenshots

Add screenshots of the application here:

```text
docs/
├── homepage.png
├── products.png
├── login.png
└── register.png
```

Example:

```markdown
![AB Fashion Homepage](docs/homepage.png)
```

---

# 🔒 Security

For production deployments:

* Never commit `.env` files.
* Never expose database credentials.
* Use strong session secrets.
* Restrict MongoDB Atlas network access where possible.
* Validate user input on the backend.
* Protect administrative endpoints.
* Use HTTPS in production.
* Keep dependencies updated.

---

# 📈 Future Improvements

Possible future improvements include:

* 🛒 Shopping cart persistence
* ❤️ Wishlist
* 💳 Payment integration
* 📦 Order management
* 👤 User profile dashboard
* 🔎 Advanced product search
* 🏷️ Product categories and filters
* ⭐ Product reviews and ratings
* 📱 Improved mobile experience
* 🧑‍💼 Admin dashboard
* 📊 Advanced analytics
* 🔔 Order notifications

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/new-feature
```

3. Make your changes.
4. Commit your changes:

```bash
git commit -m "Add new feature"
```

5. Push your branch:

```bash
git push origin feature/new-feature
```

6. Open a Pull Request.

---

# 📄 License

This project is currently available for educational and development purposes.

Add your preferred license here if you plan to distribute the project publicly.

---

# 👨‍💻 Author

**AB Fashion**

Built with ❤️ using:

**React + Vite + Node.js + Express + MongoDB + Three.js**

---

## ⭐ If you like this project

Give the repository a ⭐ on GitHub and feel free to contribute!
