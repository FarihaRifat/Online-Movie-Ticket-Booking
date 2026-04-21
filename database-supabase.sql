-- ============================================
-- Online Movie Ticket Booking Database Schema
-- PostgreSQL Version for Supabase
-- ============================================

-- Drop tables if they exist (optional, for fresh start)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS showtimes CASCADE;
DROP TABLE IF EXISTS movies CASCADE;

-- ============================================
-- Table: movies
-- Stores movie information
-- ============================================
CREATE TABLE IF NOT EXISTS movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  "posterUrl" VARCHAR(500) NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Table: showtimes
-- Stores showtime information for movies
-- Time stored in 12-hour format (e.g., "12:00 PM", "04:00 PM", "08:00 PM")
-- ============================================
CREATE TABLE IF NOT EXISTS showtimes (
  id SERIAL PRIMARY KEY,
  movie_id INT NOT NULL,
  time VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- ============================================
-- Table: bookings
-- Stores booking information
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  movie_id INT NOT NULL,
  showtime TIMESTAMP NOT NULL,
  seats VARCHAR(255) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  contact_number VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- ============================================
-- Create indexes for better performance
-- ============================================
CREATE INDEX idx_showtimes_movie_id ON showtimes(movie_id);
CREATE INDEX idx_bookings_movie_id ON bookings(movie_id);

-- ============================================
-- End of SQL Script - Database is ready!
-- ============================================
