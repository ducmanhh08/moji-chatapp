# Moji — Real-Time Chat Application

Moji is a full-stack, real-time messaging application built with the MERN stack and Socket.IO. It supports direct messages, group chats, a friend request system, live presence/read-receipts, and emoji-rich conversations — with a modern, accessible UI built on shadcn/Radix components.


---

## ✨ Features

- **Real-time messaging** over WebSockets (Socket.IO) — messages, presence, and read receipts update instantly across all connected clients.
- **Direct & group conversations** with unread-message counters and "seen by" read receipts.
- **Friend system** — send, accept, and decline friend requests; only friends can start a direct conversation or be added to a group.
- **Secure authentication** — short-lived JWT access tokens paired with rotating, database-backed refresh tokens stored in an `httpOnly` cookie.
- **Online presence** — see which of your friends are online in real time.
- **Emoji picker** (`emoji-mart`) for expressive messaging, in keeping with the app's name.
- **Avatar uploads** via Cloudinary, streamed straight from memory (no temp files) using Multer.
- **Cursor-based pagination** for infinite-scrolling message history.
- **Interactive API docs** served at `/api-docs` via Swagger UI.
- **Light/dark theme**, responsive layout, and reusable shadcn/Radix UI components.

## 🛠 Tech Stack

**Frontend**
- React 19 + TypeScript, built with Vite
- Zustand for state management (auth, chat, friends, sockets, theme)
- React Router v7, React Hook Form + Zod for validated forms
- Tailwind CSS v4 + shadcn/ui + Radix primitives
- Socket.IO client, Axios, emoji-mart, Sonner (toasts)

**Backend**
- Node.js + Express 5 (ESM)
- MongoDB + Mongoose (compound indexes, TTL-expiring sessions)
- Socket.IO server with JWT-authenticated connections
- JWT (access tokens) + rotating refresh tokens persisted in MongoDB
- Cloudinary + Multer for image uploads
- Swagger UI for API documentation

**Deployment**: frontend and backend are deployed independently (e.g. Render), communicating via a configured `CLIENT_URL` / `VITE_API_URL`.

## 🏗 Architecture

```
moji-chatapp/
├── backend/
│   └── src/
│       ├── controllers/   # Business logic (auth, users, friends, messages, conversations)
│       ├── models/        # Mongoose schemas (User, Conversation, Message, Friend, FriendRequest, Session)
│       ├── routes/        # Express route definitions
│       ├── middlewares/   # Auth, friendship checks, uploads, socket auth
│       ├── socket/        # Socket.IO server, presence tracking, room management
│       └── server.js      # App entry point
└── frontend/
    └── src/
        ├── components/    # Chat UI, auth forms, friend requests, profile, sidebar, ui primitives
        ├── stores/         # Zustand stores (auth, chat, friends, sockets, theme, user)
        ├── services/       # Axios API clients
        ├── pages/          # Route-level pages (sign in/up, chat app)
        └── types/          # Shared TypeScript types
```

### How real-time messaging works
1. On login, the client opens a Socket.IO connection authenticated with the JWT access token.
2. The server verifies the token, tracks the user as online, and auto-joins them to every conversation room they belong to.
3. Sending a message hits a REST endpoint (`POST /api/messages/direct` or `/group`), which persists the message and updates the parent conversation (last message, unread counts).
4. The server then emits the new message over the relevant Socket.IO room, so every participant's UI updates instantly — no polling required.
5. Read receipts (`PATCH /api/conversations/:id/seen`) and presence (`online-users`) follow the same emit pattern.

## 🔐 Authentication Flow

- **Access token**: short-lived JWT (30 min), sent as `Authorization: Bearer <token>` on every API request and used to authenticate Socket.IO handshakes.
- **Refresh token**: a random 64-byte token, stored `httpOnly`/`secure` in a cookie and mirrored in a MongoDB `Session` document (TTL-indexed to auto-expire after 14 days), enabling silent token renewal via `POST /api/auth/refresh`.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB connection string (e.g. MongoDB Atlas)
- A Cloudinary account (for avatar uploads)

### 1. Clone the repo
```bash
git clone https://github.com/ducmanhh08/moji-chatapp.git
cd moji-chatapp
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env   # then fill in your own values, see below
npm run dev             # starts on http://localhost:5001
```

Environment variables (`backend/.env`):
| Variable | Description |
|---|---|
| `PORT` | Port the API server listens on |
| `MONGODB_CONNECTIONSTRING` | MongoDB connection string |
| `CLIENT_URL` | URL of the frontend (for CORS) |
| `ACCESS_TOKEN_SECRET` | Secret used to sign JWT access tokens |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials for image uploads |

> 🔒 **Note:** Generate your own secrets/credentials — never commit real values to `.env.example`.

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev              # starts on http://localhost:5173
```

Environment variables (`frontend/.env.development`):
| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend REST API |
| `VITE_SOCKET_URL` | Base URL of the backend Socket.IO server |

### 4. API Documentation
Once the backend is running, interactive API docs are available at:
```
http://localhost:5001/api-docs
```

## 📡 Core API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Create a new account |
| `POST` | `/api/auth/signin` | Sign in and receive an access token |
| `POST` | `/api/auth/refresh` | Exchange a refresh token for a new access token |
| `GET` | `/api/users/me` | Get the current authenticated user |
| `GET` | `/api/users/search?username=` | Search for a user by username |
| `POST` | `/api/users/uploadAvatar` | Upload/update profile avatar |
| `POST` | `/api/friends/requests` | Send a friend request |
| `POST` | `/api/friends/requests/:id/accept` | Accept a friend request |
| `GET` | `/api/friends` | List all friends |
| `POST` | `/api/conversations` | Create a direct or group conversation |
| `GET` | `/api/conversations` | List the user's conversations |
| `GET` | `/api/conversations/:id/messages` | Paginated message history |
| `PATCH` | `/api/conversations/:id/seen` | Mark a conversation as read |
| `POST` | `/api/messages/direct` | Send a direct message |
| `POST` | `/api/messages/group` | Send a group message |


## 📄 License

This project currently has no license specified. All rights reserved by the author unless stated otherwise.

## 👤 Author

**Duc Manh** — [@ducmanhh08](https://github.com/ducmanhh08)