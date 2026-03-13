# 🇮🇳 Hidden India — AI-Powered Smart Tourism Platform

> Discover India's most underrated, culturally rich destinations with the power of AI.

## 🌟 Features

- **Destination Discovery** — 10+ curated hidden destinations with rich cultural data
- **AI Travel Guide (Priya)** — GPT-powered chatbot for travel Q&A
- **Google Maps Integration** — Interactive maps + nearby services finder
- **Location-Based Community Chat** — Talk with travelers at the same destination
- **JWT Authentication** — Secure register/login
- **Reviews System** — Rate and review destinations

---

## 📁 Project Structure

```
hidden-india/
├── backend/                    # Node.js + Express API
│   ├── controllers/            # Business logic
│   ├── middleware/             # JWT auth middleware
│   ├── models/                 # Database connection
│   ├── routes/                 # API routes
│   ├── server.js               # Entry point
│   └── .env.example            # Environment variables template
├── frontend/                   # React.js app
│   ├── public/                 # Static files
│   └── src/
│       ├── components/         # Reusable components
│       ├── context/            # React context (auth)
│       ├── pages/              # Page components
│       └── services/           # API service layer
└── database/
    └── schema.sql              # MySQL schema + seed data
```

---

## 🛠️ Prerequisites

- **Node.js** v18+ 
- **MySQL** v8+
- **npm** or **yarn**
- **OpenAI API Key** — [Get one here](https://platform.openai.com/api-keys)
- **Google Maps API Key** — [Get one here](https://console.cloud.google.com/)

---

## 🚀 Setup Instructions

### Step 1: Clone and Setup Database

```bash
# Create the database
mysql -u root -p

# In MySQL shell:
CREATE DATABASE hidden_india;
EXIT;

# Import schema and seed data
mysql -u root -p hidden_india < database/schema.sql
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `backend/.env` with your credentials:

```env
PORT=5000
NODE_ENV=development

# MySQL credentials
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=hidden_india

# JWT secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_at_least_32_chars

# OpenAI API key
OPENAI_API_KEY=sk-your-openai-api-key-here

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

Start the backend:

```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

Backend runs on: `http://localhost:5000`

### Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

Edit `frontend/.env.local`:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

Start the frontend:

```bash
npm start
```

Frontend runs on: `http://localhost:3000`

---

## 🗺️ Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - **Maps JavaScript API**
   - **Places API**
4. Create an API key under **Credentials**
5. Add the key to `frontend/.env.local`

**Note:** Without the API key, maps won't load but all other features work fine.

---

## 🤖 OpenAI Setup

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to `backend/.env`
4. The AI assistant uses **GPT-3.5-turbo** by default

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get current user profile |

### Locations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/locations` | List all locations (with search/filter) |
| GET | `/api/locations/states` | Get all unique states |
| GET | `/api/locations/:id` | Get location + reviews |
| POST | `/api/locations/:id/reviews` | Add review (auth required) |

### Community Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/:locationId` | Get messages for location |
| POST | `/api/messages` | Post message (auth required) |

### AI Assistant
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | Chat with AI (auth required) |

---

## 🚢 Deployment

### Frontend → Vercel

```bash
# Install Vercel CLI
npm i -g vercel

cd frontend
vercel

# Add environment variables in Vercel dashboard:
# REACT_APP_BACKEND_URL = https://your-backend.render.com
# REACT_APP_GOOGLE_MAPS_API_KEY = your_key
```

### Backend → Render

1. Push code to GitHub
2. Create new **Web Service** on [Render](https://render.com)
3. Connect your repo
4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Add all environment variables from `.env`

### Database → PlanetScale or Railway

For MySQL, use **Railway** or **PlanetScale**:
```bash
# Railway: https://railway.app
# Create MySQL service, get connection URL
# Update DB_* env vars accordingly
```

---

## 🎯 Key Design Decisions

- **JWT tokens** stored in localStorage with 7-day expiry
- **Community chat** uses 5-second polling (can be upgraded to WebSockets)
- **Reviews** update location rating automatically via SQL aggregate
- **AI context** includes location info when user is on a destination page
- **Google Maps** loads lazily only on the Nearby Services page

---

## 📱 Responsive Design

The app is fully responsive:
- **Desktop**: Full sidebar + main content layouts
- **Tablet**: Collapsed sidebars, stacked layouts
- **Mobile**: Single column, hamburger navigation

---

## 🔧 Environment Variables Summary

### Backend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 5000) | No |
| `DB_HOST` | MySQL host | Yes |
| `DB_PORT` | MySQL port (default: 3306) | No |
| `DB_USER` | MySQL username | Yes |
| `DB_PASSWORD` | MySQL password | Yes |
| `DB_NAME` | Database name | Yes |
| `JWT_SECRET` | Secret for JWT signing | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes (for AI) |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |

### Frontend (.env.local)
| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_BACKEND_URL` | Backend API URL | Yes |
| `REACT_APP_GOOGLE_MAPS_API_KEY` | Google Maps API key | No (maps optional) |

---

## 🌏 Seeded Destinations

The schema includes 10 carefully researched hidden destinations:

1. **Etikoppaka, Andhra Pradesh** — Lacquer toy village
2. **Ziro Valley, Arunachal Pradesh** — Apatani tribal culture
3. **Majuli Island, Assam** — World's largest river island
4. **Spiti Valley, Himachal Pradesh** — High-altitude desert monastery
5. **Gokarna, Karnataka** — Sacred coastal town
6. **Chopta, Uttarakhand** — Mini Switzerland of India
7. **Mawlynnong, Meghalaya** — Asia's cleanest village
8. **Hampi, Karnataka** — Vijayanagara Empire ruins
9. **Tawang, Arunachal Pradesh** — Largest monastery in India
10. **Pondicherry Countryside, Puducherry** — French-Tamil fusion & Auroville

---
