# TaskFlow

Full-stack TODO application with JWT authentication, personal tasks, status filtering, and SQLite persistence.

## Technology

- Next.js, React, TypeScript
- TanStack React Query and Axios
- Express.js and TypeScript
- Sequelize ORM
- SQLite database
- JWT authentication and bcrypt password hashing

## Requirements

- Node.js 20+
- npm

## Installation

Install dependencies separately for the API and frontend:

```bash
cd server
npm install

cd ../client
npm install
```

Create `server/.env`:

```env
PORT=5000
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:3000
```

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

SQLite is used by default. The database file is created automatically when the server starts.

## Run

Use two terminals:

```bash
cd server
npm run dev
```

```bash
cd client
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

Server:

- `npm run dev` - start the development API
- `npm run build` - compile the API
- `npm start` - start the compiled API

Client:

- `npm run dev` - start Next.js development server
- `npm run lint` - run ESLint
- `npm run build` - create the production build
- `npm start` - serve the production build

## Features

- Separate `/login` and `/register` pages
- JWT registration and login
- Protected task management for the current user
- Create, read, update, and delete tasks
- Task fields: title, description, and `todo` / `in progress` / `done` status
- Filter tasks by status
- Client-side form validation
- Friendly API error messages
- Automatic redirects for authenticated and unauthenticated users
- Responsive UI and custom 404 page

## API

Authentication:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Tasks require `Authorization: Bearer <token>`:

- `POST /api/tasks`
- `GET /api/tasks`
- `GET /api/tasks?status=todo`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Assignment Checklist

- [x] JWT authentication: registration and login
- [x] Task CRUD
- [x] Task status filtering
- [x] SQLite database
- [x] Next.js frontend
- [x] React Query for API state
- [x] Express.js backend
- [x] Sequelize ORM

## Verification

The project has been checked with:

```bash
cd server && npm run build
cd client && npm run lint
cd client && npm run build
```
