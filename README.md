# Neko App - Web App Starter Pack

A modern full stack starter pack built with **Vue 3 + Tabler UI**, **Express.js**, and **Prisma ORM** — designed to help you get up and running fast with clean architecture and beautiful UI.

---

## 🚀 Tech Stack

| Layer       | Technology         |
|-------------|--------------------|
| Frontend    | [Vue 3](https://vuejs.org/), [Vite](https://vitejs.dev/), [Tabler UI](https://tabler.io/) |
| Backend     | [Express.js](https://expressjs.com/) |
| Database    | [Prisma ORM](https://www.prisma.io/) |
| Styling     | Tabler CSS (via CDN) |
| Auth-ready? | ✅ Easily extendable (JWT/session) |
| DB Support  | ✅ PostgreSQL / MySQL / SQLite (configurable via Prisma) |

---

## 📦 Folder Structure

```bash
.
├── client/                 # Vue 3 + Tabler UI frontend
│   └── src/
│       └── components/
│           └── Login.vue
├── server/                 # Express backend
│   ├── prisma/             # Prisma schema and migrations
│   ├── routes/
│   └── index.ts            # Main Express server
├── .env                    # Environment variables
├── package.json
