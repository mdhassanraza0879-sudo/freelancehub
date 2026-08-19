# FreelanceHub 🚀

**India's Professional Freelancer Portfolio & Job Board Platform**

Connect skilled freelancers with clients. Built with the MERN stack.

---

## ✨ Features

- 🔐 **JWT Authentication** — Register/Login as Freelancer or Client
- 🎨 **Portfolio Pages** — Public profile URLs (`/freelancers/:username`)
- 💼 **Job Board** — Post, browse, and apply for jobs
- 🔍 **Search & Filters** — By skill, category, budget, experience
- 📊 **Role Dashboards** — Freelancer (applications) & Client (job postings)
- 💎 **Premium System** — Foundation for monetization

---

## 🛠️ Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18, Vite, React Router, Axios |
| Backend  | Node.js, Express.js                 |
| Database | MongoDB, Mongoose                   |
| Auth     | JWT, bcryptjs                       |
| UI       | Custom CSS Design System, Lucide    |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://mongodb.com/atlas) — free tier)

### 1. Clone & Setup Backend

```bash
cd server
npm install
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/freelancehub
JWT_SECRET=your_secret_key_here
```

Start server:
```bash
npm run dev
```

### 2. Setup Frontend

```bash
cd client
npm install
npm run dev
```

### 3. Open in Browser

- **Frontend:** http://localhost:5173
- **API:** http://localhost:5000

---

## 📁 Project Structure

```
freelance-hub/
├── server/
│   ├── models/          # MongoDB Schemas (User, Job, Application)
│   ├── routes/          # API Routes (auth, users, jobs, applications)
│   ├── middleware/       # JWT Auth Middleware
│   └── server.js        # Express App Entry Point
│
└── client/
    └── src/
        ├── components/  # Navbar, JobCard, FreelancerCard
        ├── context/     # AuthContext
        ├── pages/       # Home, Login, Register, Dashboard...
        └── utils/       # Axios API Client
```

---

## 💰 Income Model

| Feature            | Price     |
|--------------------|-----------|
| Premium Profile    | ₹199/mo   |
| Featured Job Post  | ₹299/post |
| Priority Alerts    | ₹99/mo    |

---

## 🗺️ Roadmap

- [ ] Razorpay payment integration
- [ ] In-app messaging
- [ ] AI freelancer-job matching
- [ ] Email notifications
- [ ] Review & rating system
- [ ] Mobile app (React Native)

---

Made with ❤️ for India's growing freelance economy.
