# Fullstack Product Management System

This is a complete Product Management System built with:
- **Frontend**: React + TypeScript + Vite + TailwindCSS + React Query
- **Backend**: Node.js + Express + TypeScript + Prisma ORM + Zod
- **Database**: PostgreSQL

## Project Structure
- `/client` - React frontend
- `/server` - Express backend

## Prerequisites
- Node.js (v18 or higher recommended)
- PostgreSQL running locally or in a container

## 1. Database Setup
You can either use the `database.sql` file provided to manually create the table, or let Prisma handle it automatically.

Create a database named `product_management` in your PostgreSQL instance.

```bash
psql -U postgres
CREATE DATABASE product_management;
```

## 2. Backend Setup (`/server`)

Navigate to the server directory:
```bash
cd server
```

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Copy `.env.example` to `.env` and update your PostgreSQL connection string:
```bash
cp .env.example .env
```
Ensure the `DATABASE_URL` matches your local setup (e.g., `postgresql://postgres:postgres@localhost:5432/product_management?schema=public`).

3. Run database migrations:
```bash
npx prisma db push
```

4. Start the development server:
```bash
npm run dev
```
The backend will run on `http://localhost:3000`.

## 3. Frontend Setup (`/client`)

Navigate to the client directory in a new terminal:
```bash
cd client
```

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`. Open this URL in your browser.

## Features
- **Create, Read, Update, Delete (CRUD)** operations for Products
- **Pagination** on the backend and frontend
- **Debounced Search** by product name
- **Sorting** by clicking on table column headers
- **Optimistic UI Updates** for responsive deletions
- **Toast Notifications** for success/error states
- **Form Validation** powered by Zod (backend) and inline validation (frontend)

## Docker Setup (Backend)
To run the backend in a Docker container:
```bash
cd server
docker build -t product-management-api .
docker run -p 3000:3000 --env-file .env product-management-api
```
