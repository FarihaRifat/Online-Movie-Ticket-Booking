-- ============================================
-- Cinematic Ticket Booker Database Schema
-- Database: ticket_booking_db
-- ============================================

-- Create database (if it doesn't exist)
CREATE DATABASE IF NOT EXISTS `ticket_booking_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `ticket_booking_db`;

-- ============================================
-- Table: movies
-- Stores movie information
-- ============================================
CREATE TABLE IF NOT EXISTS `movies` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `posterUrl` VARCHAR(500) NOT NULL,
  `price` DECIMAL(10, 2) DEFAULT 0.00,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- Table: showtimes
-- Stores showtime information for movies
-- Time stored in 12-hour format (e.g., "12:00 PM", "04:00 PM", "08:00 PM")
-- ============================================
CREATE TABLE IF NOT EXISTS `showtimes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `movie_id` INT(11) NOT NULL,
  `time` VARCHAR(10) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `movie_id` (`movie_id`),
  CONSTRAINT `showtimes_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- Table: bookings
-- Stores booking information
-- ============================================
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `movie_id` INT(11) NOT NULL,
  `showtime` DATETIME NOT NULL,
  `seats` VARCHAR(255) NOT NULL,
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `contact_number` VARCHAR(20) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `movie_id` (`movie_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- Sample Data: Movies
-- ============================================
-- Removed sample data for fresh start

-- ============================================
-- Sample Data: Showtimes
-- ============================================
-- Removed sample showtimes for fresh start

-- ============================================
-- Sample Data: Bookings (Optional)
-- ============================================
-- Removed sample bookings for fresh start

-- ============================================
-- Additional Movies (More movies to add)
-- ============================================
-- Removed additional movies for fresh start

-- ============================================
-- End of SQL Script
-- ============================================
