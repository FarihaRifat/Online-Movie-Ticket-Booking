// ============================================
// API Configuration
// Update this file to point to your backend server
// ============================================

// For local development with XAMPP or PHP server
// Use one of the following based on your setup:

// Option 1: If backend is in the same directory (recommended for easy deployment)
export const API_BASE_URL = "http://localhost/movie-booking-app";

// Option 2: If backend is on a different port
// export const API_BASE_URL = "http://localhost:8000";

// Option 3: If backend is on a remote server
// export const API_BASE_URL = "https://your-domain.com/backend";

// API Endpoints
export const API_ENDPOINTS = {
  getMovies: `${API_BASE_URL}/backend-getMovies.php`,
  createMovie: `${API_BASE_URL}/backend-createMovie.php`,
  updateMovie: `${API_BASE_URL}/backend-updateMovie.php`,
  deleteMovie: `${API_BASE_URL}/backend-deleteMovie.php`,
  bookSeats: `${API_BASE_URL}/backend-bookSeats.php`,
};

// Export individual endpoints for convenience
export const {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  bookSeats,
} = API_ENDPOINTS;
