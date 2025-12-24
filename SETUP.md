# Project Setup Guide

This is a full-stack application with:

- **Backend**: NestJS server (port 3001)
- **Frontend**: React + Vite (port 5173)
- **Database**: MySQL

## Prerequisites

1. **Node.js** (v18 or higher recommended)
2. **MySQL** (v8.0 or higher)
3. **npm** or **yarn** package manager

## Database Setup

The backend expects a MySQL database with these credentials:

- **Host**: localhost
- **Port**: 3306
- **Username**: root
- **Password**: password
- **Database**: murmur_db

### Option 1: Create MySQL Database Manually

```bash
# Connect to MySQL (adjust credentials if needed)
mysql -u root -p

# Create database and user
CREATE DATABASE murmur_db;
CREATE USER 'docker'@'localhost' IDENTIFIED BY 'docker';
GRANT ALL PRIVILEGES ON murmur_db.* TO 'docker'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Option 2: Update Database Credentials

If you want to use different MySQL credentials, edit:

- `server/src/app.module.ts` - Update the TypeORM configuration

## Running the Project

### Step 1: Start the Backend Server

```bash
cd server
npm run start:dev
# or
yarn start:dev
```

The server will start on **http://localhost:3001**

### Step 2: Start the Frontend (in a new terminal)

```bash
cd client
npm run dev
# or
yarn dev
```

The frontend will start on **http://localhost:5173**

## Access the Application

Once both servers are running:

- Open your browser and go to: **http://localhost:5173**

## Troubleshooting

### Database Connection Issues

- Make sure MySQL is running: `mysql.server start` (macOS) or `sudo systemctl start mysql` (Linux)
- Verify database exists: `mysql -u docker -pdocker -e "SHOW DATABASES;"`
- Check if the database `murmur_db` exists

### Port Already in Use

- Backend: Change `PORT` in `server/src/main.ts` or set `PORT=3002` environment variable
- Frontend: Change port in `src/vite.config.ts`

### Dependencies Not Installed

```bash
# Backend
cd server
npm install
# or yarn install

# Frontend
cd src
npm install
# or yarn install
```

## Available Scripts

### Backend (server/)

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server

### Frontend (src/)

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Preview production build
