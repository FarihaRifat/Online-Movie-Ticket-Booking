# Online Movie Ticket Booking System

A modern web application for booking movie tickets, built with React frontend and PHP backend.

## Project Structure

```
movie-ticket-booking-app/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── App.jsx          # Main App component
│   │   ├── apiConfig.js     # API endpoints configuration
│   │   ├── constants.js     # Application constants
│   │   ├── types.js         # TypeScript-like definitions
│   │   └── index.css        # Global styles
│   ├── index.html           # HTML template
│   ├── index.jsx            # React entry point
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.js       # Vite configuration
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── postcss.config.js    # PostCSS configuration
├── backend/                 # PHP backend API
│   ├── index.php            # API entry point and routing
│   ├── backend-config.php   # Database configuration
│   ├── backend-getMovies.php
│   ├── backend-createMovie.php
│   ├── backend-updateMovie.php
│   ├── backend-deleteMovie.php
│   ├── backend-bookSeats.php
│   └── config-supabase.php  # Supabase configuration
├── database.sql             # Database schema
├── database-supabase.sql    # Supabase database schema
└── README.md
```

## Features

- Browse and search movies
- Book tickets for different showtimes
- Movie management (CRUD operations)
- Responsive design with Tailwind CSS

## 🚀 Deployment

Your app is now configured for Supabase PostgreSQL deployment! Follow these steps:

### 1. Database Setup
1. Go to [Supabase](https://supabase.com) and create/login to your account
2. Create a new project or use an existing one
3. Go to **SQL Editor** in your Supabase dashboard
4. Copy and paste the entire contents of `SUPABASE_SETUP.sql`
5. Click **Run** to execute the SQL script

### 2. Deploy Backend
1. Upload the `backend/` folder to a PHP hosting service (Heroku, Railway, etc.)
2. Ensure PHP 8.2+ with PDO PostgreSQL extension
3. Note your backend URL for the next step

### 3. Deploy Frontend
1. Update `frontend/src/apiConfig.js` with your backend URL:
   ```javascript
   export const API_ENDPOINTS = {
     getMovies: 'https://your-backend-domain.com/api/movies',
     createMovie: 'https://your-backend-domain.com/api/movies',
     updateMovie: 'https://your-backend-domain.com/api/movies/update',
     deleteMovie: 'https://your-backend-domain.com/api/movies/delete',
     bookSeats: 'https://your-backend-domain.com/api/bookings',
   };
   ```
2. Build the frontend: `cd frontend && npm run build`
3. Upload the `dist/` folder to Vercel, Netlify, or your hosting service

### 4. Test Your Deployment
1. Create a booking through your deployed frontend
2. Check your Supabase dashboard - the booking should appear in the `bookings` table
3. Your teacher can now verify bookings in Supabase!

## 📋 Quick Start (Local Development)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie-ticket-booking-app
   ```

2. **Setup Backend**
   ```bash
   # Set DATABASE_URL or pooler variables (see DEPLOYMENT_README.md)
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Start Backend Server**
   ```bash
   cd backend
   php -S localhost:8000 index.php
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## 🔧 Configuration

### Database configuration (production)
Use **Railway variables**: `DATABASE_URL` (Supabase **Session pooler** URI) or `SUPABASE_POOLER_HOST` + `SUPABASE_DB_PASSWORD`. See **`DEPLOYMENT_README.md`**.

### API base URL (frontend)
Set **`VITE_API_BASE_URL`** at Netlify build time if your Railway URL changes; otherwise the default in `apiConfig.js` is used.

## Prerequisites

- Node.js 16+ and npm
- PHP 7+
- PostgreSQL database (or Supabase account)
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/FarihaRifat/Online-Movie-Ticket-Booking.git
cd Online-Movie-Ticket-Booking
```

### 2. Setup Frontend

```bash
cd frontend
npm install
cd ..
```

### 3. Setup Backend

1. **Database Setup:**
   - Create a PostgreSQL database (or use Supabase)
   - Import the `database-supabase.sql` file to create tables

2. **Backend configuration:**
   - Set Railway / server environment variables per **`DEPLOYMENT_README.md`**
   - Ensure PHP 8.2+ with `pdo_pgsql` (included in the repo `Dockerfile` for Railway)

### 4. Run the Application

```bash
# Start frontend development server
cd frontend
npm run dev
```

The app will be available at `http://localhost:3000`

### 5. Backend API

The backend API is served from `http://localhost:3000/backend/` and includes:

- `GET /backend/api/movies` - Get all movies
- `POST /backend/api/movies` - Create movie
- `PUT /backend/api/movies/update` - Update movie
- `DELETE /backend/api/movies/delete` - Delete movie
- `POST /backend/api/bookings` - Book seats

## Development

### Frontend Development

```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development

- Place backend files in a PHP server directory
- Ensure CORS headers are properly configured
- Update API endpoints in `frontend/src/apiConfig.js` if needed

## Database Schema

The application uses the following main tables:
- `movies` - Movie information
- `bookings` - Seat bookings

See `database-supabase.sql` for the complete schema.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is for educational purposes.

You can find the backend files or create them based on the API endpoints used in the frontend.

Required backend files:
- `config.php` - Database configuration
- `getMovies.php` - Fetch movies
- `createMovie.php` - Add new movie
- `updateMovie.php` - Update movie
- `deleteMovie.php` - Delete movie
- `bookSeats.php` - Handle bookings

### 5. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:3004`

## API Endpoints

- GET `/cinematic-ticket-booker-backend/getMovies.php` - Get all movies
- POST `/cinematic-ticket-booker-backend/createMovie.php` - Create movie
- PUT `/cinematic-ticket-booker-backend/updateMovie.php` - Update movie
- DELETE `/cinematic-ticket-booker-backend/deleteMovie.php` - Delete movie
- POST `/cinematic-ticket-booker-backend/bookSeats.php` - Book seats

## Database Schema

The `database.sql` file contains the schema for:
- `movies` table
- `showtimes` table
- `bookings` table

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is for educational purposes.
