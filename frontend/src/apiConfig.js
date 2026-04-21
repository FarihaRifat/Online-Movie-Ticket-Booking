// API Configuration for Movie Ticket Booking App
// Update these URLs when deploying to production

export const API_ENDPOINTS = {
  // For local development
  // getMovies: 'http://localhost:8000/api/movies',
  // createMovie: 'http://localhost:8000/api/movies',
  // updateMovie: 'http://localhost:8000/api/movies/update',
  // deleteMovie: 'http://localhost:8000/api/movies/delete',
  // bookSeats: 'http://localhost:8000/api/bookings',

  // For production deployment
  getMovies: 'https://online-movie-ticket-booking-production.up.railway.app/api/movies',
  createMovie: 'https://online-movie-ticket-booking-production.up.railway.app/api/movies',
  updateMovie: 'https://online-movie-ticket-booking-production.up.railway.app/api/movies/update',
  deleteMovie: 'https://online-movie-ticket-booking-production.up.railway.app/api/movies/delete',
  bookSeats: 'https://online-movie-ticket-booking-production.up.railway.app/api/bookings',
};