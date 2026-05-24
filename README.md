# Modern E-Commerce Web Application

This repository contains a full-stack MERN ecommerce app with:
- React + Vite frontend
- Express backend with JWT authentication
- MongoDB data storage with Mongoose
- Admin product management
- Cart and order workflows

## Project Structure

- `backend/` — Express API and database models
- `frontend/` — React application with routes and user interface

## Setup

1. Copy environment variables:
   - `backend/.env.example` -> `backend/.env`
   - `frontend/.env.example` -> `frontend/.env`
2. Install dependencies:
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
3. Run locally:
   - Backend: `npm run dev` from `backend/`
   - Frontend: `npm run dev` from `frontend/`

## Deployment Notes

- Backend is ready for Render / Railway using the `PORT` and `MONGO_URI` env vars.
- Frontend uses `VITE_API_URL` to connect to the backend.
- No hardcoded localhost URLs are used in the code.
