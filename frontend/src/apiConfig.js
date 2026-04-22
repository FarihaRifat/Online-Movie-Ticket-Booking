// Production API base: set VITE_API_BASE_URL in Netlify (or .env) if your Railway URL changes.
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://online-movie-ticket-booking-production.up.railway.app").replace(/\/$/, "");

export const API_ENDPOINTS = {
  getMovies: `${API_BASE}/api/movies`,
  createMovie: `${API_BASE}/api/movies`,
  updateMovie: `${API_BASE}/api/movies/update`,
  deleteMovie: `${API_BASE}/api/movies/delete`,
  bookSeats: `${API_BASE}/api/bookings`,
};
