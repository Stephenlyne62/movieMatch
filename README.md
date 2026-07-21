# 🎬 MovieMatch

> A modern movie discovery application built with React, powered by The Movie Database (TMDB) API.

MovieMatch is a responsive web application that enables users to discover new movies, search by title, browse detailed movie information and build a personal watchlist. The application integrates live movie data from the TMDB API, uses React Context API for global state management and stores watchlists locally using Local Storage.

---

## ✨ Features

- 🎥 Browse trending and popular movies
- 🔍 Search movies by title
- 📖 View detailed movie information
- 🎭 Browse movies by genre
- ⭐ Add and remove movies from a personal watchlist
- 💾 Persistent watchlist using Local Storage
- ⚡ Fast and responsive user experience
- 📱 Fully responsive across desktop, tablet and mobile devices

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- JavaScript (ES6+)
- CSS
- React Context API

## Client Storage

- Local Storage

## API

- TMDB (The Movie Database) API

## Deployment

- Vercel

---

# 👨‍💻 My Contribution

MovieMatch was a solo project where I designed and developed the entire application from start to finish.

Key features I implemented include:

- Responsive user interface
- Movie search functionality
- Dynamic movie details pages
- TMDB API integration
- Genre browsing
- React Context API for global state management
- Local Storage watchlist
- Component-based architecture
- Error handling
- Deployment with Vercel

---

# 📸 Screenshots

## 🏠 Home

The landing page showcases featured movies, popular releases and an intuitive search experience.

<img src="https://github.com/user-attachments/assets/c97da5fd-5bff-466c-a4c0-6486fbb65e13" />

---

### 🔥 Trending Movies

<img src="https://github.com/user-attachments/assets/f5be7180-34ed-4f52-b423-0ece75d53c13" />

---

### 🎬 Featured Content

<img src="https://github.com/user-attachments/assets/44eba9b6-22de-458d-8a4f-10bba7a1de69" />

---

## 🎞️ Catalogue

Browse movies by genre or discover new titles.

<img src="https://github.com/user-attachments/assets/5640472d-cc41-4b3a-9ff3-20538af1de3b" />

---

## 📖 Movie Details

View ratings, genres, descriptions and additional movie information.

<img src="https://github.com/user-attachments/assets/7e7c25d7-92cf-4ca4-96ad-89d5f00b6b16" />

---

## ⭐ Watchlist

Save movies to your personal watchlist using Local Storage.

<img src="https://github.com/user-attachments/assets/02dd8fa9-740d-45f6-90de-4e10d2530842" />

# 🚀 Getting Started

## Prerequisites

- Node.js (v18 or newer)
- npm

---

## Clone the Repository

```bash
git clone https://github.com/yourusername/moviematch.git

cd moviematch
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
```

---

## Start the Development Server

```bash
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

---

# 📂 Project Structure

```text
MovieMatch/

├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── public/
├── package.json
├── vite.config.js
└── README.md
```

---

# 🏗️ Architecture

```
React (Vite)

↓

React Context API

↓

TMDB API

↓

Local Storage
```

---

# 🧩 Key Architecture

### Component-Based Design

- Reusable React components
- Modular page structure
- Separation of UI and application logic

### State Management

- React Context API
- Shared global application state
- Efficient data flow between components

### API Integration

- TMDB REST API
- Movie search
- Trending movies
- Movie details
- Genre data

### Client Storage

- Local Storage
- Persistent watchlist across browser sessions

### Responsive Design

- Mobile-first layouts
- Responsive grid system
- Optimised for desktop, tablet and mobile devices

---

# 💡 Key Skills Demonstrated

- React development
- Component-based architecture
- React Context API
- REST API integration
- State management
- Local Storage persistence
- Responsive UI development
- JavaScript (ES6+)
- CSS
- Git & GitHub
- Deploying applications with Vercel

---

# 🎯 Future Improvements

Potential future enhancements include:

- User authentication
- Cloud-synchronised watchlists
- User ratings and reviews
- Personalised movie recommendations
- Streaming provider integration
- Advanced filtering and sorting
- Infinite scrolling
- Dark mode

---

# 📄 License

This project is licensed under the **MIT License**.
