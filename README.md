# Online Movie Ticket Booking System

A modern web application for booking movie tickets, built with React and PHP backend.

## Features

- Browse and search movies
- Book tickets for different showtimes
- Movie management (CRUD operations)
- Responsive design

## Tech Stack

- **Frontend:** React, Vite
- **Backend:** PHP
- **Database:** MySQL
- **Server:** XAMPP (Apache + MySQL)

## Prerequisites

- Node.js and npm
- XAMPP (for PHP and MySQL)
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/FarihaRifat/Online-Movie-Ticket-Booking.git
cd Online-Movie-Ticket-Booking
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Setup Database

1. Start XAMPP and ensure Apache and MySQL are running.
2. Open phpMyAdmin at `http://localhost/phpmyadmin`
3. Create a new database named `ticket_booking_db`
4. Import the `database.sql` file to create the tables.

### 4. Setup Backend

The backend PHP files need to be placed in `C:\xampp\htdocs\cinematic-ticket-booker-backend\`

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
