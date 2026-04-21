// API Configuration for Movie Ticket Booking App
// Update these URLs when deploying to production

export const API_ENDPOINTS = {
  // For local development
  // getMovies: 'http://localhost:8000/api/movies',
  // createMovie: 'http://localhost:8000/api/movies',
  // updateMovie: 'http://localhost:8000/api/movies/update',
  // deleteMovie: 'http://localhost:8000/api/movies/delete',
  // bookSeats: 'http://localhost:8000/api/bookings',

  // For production deployment - UPDATE THESE URLs after deploying backend
  getMovies: 'https://your-backend-domain.com/api/movies',
  createMovie: 'https://your-backend-domain.com/api/movies',
  updateMovie: 'https://your-backend-domain.com/api/movies/update',
  deleteMovie: 'https://your-backend-domain.com/api/movies/delete',
  bookSeats: 'https://your-backend-domain.com/api/bookings',
};