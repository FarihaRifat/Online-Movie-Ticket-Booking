-- ============================================
-- SUPABASE DEPLOYMENT SETUP
-- ============================================
-- Copy and paste this entire SQL into Supabase SQL Editor
-- This creates all necessary tables and indexes for the Movie Ticket Booking app
-- ============================================

-- Drop existing tables (optional, for fresh setup)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS times CASCADE;
DROP TABLE IF EXISTS movies CASCADE;

-- ============================================
-- CREATE TABLES
-- ============================================

-- Movies Table
CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    poster_url VARCHAR(500) NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Showtimes Table (referred as "times" in the system)
CREATE TABLE IF NOT EXISTS times (
    id SERIAL PRIMARY KEY,
    movie_id INT NOT NULL,
    time VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    movie_id INT NOT NULL,
    showtime VARCHAR(255) NOT NULL,
    seats VARCHAR(255) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_times_movie_id ON times(movie_id);
CREATE INDEX IF NOT EXISTS idx_bookings_movie_id ON bookings(movie_id);
CREATE INDEX IF NOT EXISTS idx_bookings_contact ON bookings(contact_number);

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- Sample Movies
INSERT INTO movies (title, description, poster_url, price) VALUES
('The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 12.99),
('Inception', 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: inception.', 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', 11.99),
('Interstellar', 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.', 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', 13.99),
('The Matrix', 'Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.', 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', 10.99);

-- Sample Showtimes
INSERT INTO times (movie_id, time) VALUES
(1, '12:00 PM'),
(1, '04:00 PM'),
(1, '08:00 PM'),
(2, '01:00 PM'),
(2, '05:00 PM'),
(2, '09:00 PM'),
(3, '11:00 AM'),
(3, '03:00 PM'),
(3, '07:00 PM'),
(4, '02:00 PM'),
(4, '06:00 PM'),
(4, '10:00 PM');

-- ============================================
-- DATABASE READY FOR DEPLOYMENT!
-- ============================================
-- Tables created:
-- 1. movies (id, title, description, poster_url, price, created_at)
-- 2. times (id, movie_id, time, created_at) - for showtimes
-- 3. bookings (id, movie_id, showtime, seats, total_amount, contact_number, created_at)
--
-- Indexes created for:
-- - times.movie_id (for fast lookups by movie)
-- - bookings.movie_id (for fast lookups by movie)
-- - bookings.contact_number (for finding customer bookings)
--
-- Your backend is configured to:
-- - Connect to this Supabase PostgreSQL database
-- - Create bookings when users buy tickets
-- - Fetch movies and display them
-- - Support CRUD operations on movies
-- ============================================
