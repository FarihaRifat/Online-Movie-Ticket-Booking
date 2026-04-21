import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage.jsx';
import BookingPage from './components/BookingPage.jsx';
import ReceiptPage from './components/ReceiptPage.jsx';
import MovieManagement from './components/MovieManagement.jsx';
import { SeatStatus } from './types.js';
import { FALLBACK_MOVIES } from './constants.js';
import { API_ENDPOINTS } from './apiConfig.js';

const App = () => {
  const [view, setView] = useState('home');
  const [movies, setMovies] = useState(FALLBACK_MOVIES);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);

  const DEFAULT_SHOWTIMES = ["12:00 PM", "04:00 PM", "08:00 PM"];

  const generateSeats = (rows = 8, cols = 12) => {
    const seats = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      const rowLetter = String.fromCharCode(65 + i);
      for (let j = 0; j < cols; j++) {
        const isBooked = Math.random() < 0.2;
        row.push({
          id: `${rowLetter}${j + 1}`,
          status: isBooked ? SeatStatus.Booked : SeatStatus.Available,
        });
      }
      seats.push(row);
    }
    return seats;
  };

  const fetchMovies = () => {
    fetch(API_ENDPOINTS.getMovies)
      .then(res => res.json())
      .then(data => {
        if ((data.success || data.status === "success") && Array.isArray(data.data)) {
          const mappedMovies = data.data.map(m => ({
            id: parseInt(m.id),
            title: m.title || "Untitled Movie",
            description: m.description || "No description available.",
            posterUrl: (m.posterUrl || "https://via.placeholder.com/500x750?text=No+Image").trim(),
            price: m.price ? parseFloat(m.price) : 12.50,
            showtimes: DEFAULT_SHOWTIMES.map(time => ({
              time,
              seats: generateSeats()
            }))
          }));
          setMovies(mappedMovies);
        }
      })
      .catch(err => {
        console.error("Error fetching movies:", err);
      });
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setView('booking');
  };

  const handleAddMovie = async (movieData) => {
    try {
      const response = await fetch(API_ENDPOINTS.createMovie, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieData)
      });

      const data = await response.json();
      if (data.success || data.status === "success") {
        fetchMovies();
      } else {
        alert(`Failed to add movie: ${data.error || data.message}`);
      }
    } catch (error) {
      console.error("Error adding movie:", error);
      alert("Error adding movie. Please try again.");
    }
  };

  const handleEditMovie = async (movieId, movieData) => {
    try {
      const response = await fetch(API_ENDPOINTS.updateMovie, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: movieId,
          ...movieData
        })
      });

      const data = await response.json();
      if (data.success || data.status === "success") {
        await fetchMovies();
        return { success: true };
      } else {
        alert(`Failed to update movie: ${data.error || data.message}`);
        return { success: false, error: data.error || data.message };
      }
    } catch (error) {
      console.error("Error updating movie:", error);
      alert("Error updating movie. Please try again.");
      return { success: false, error: error.message };
    }
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      const response = await fetch(API_ENDPOINTS.deleteMovie, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: movieId })
      });

      const data = await response.json();
      if (data.success || data.status === "success") {
        fetchMovies();
      } else {
        alert(`Failed to delete movie: ${data.error || data.message}`);
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("Error deleting movie. Please try again.");
    }
  };

  const handleConfirmBooking = async (details) => {
    try {
      const response = await fetch(API_ENDPOINTS.bookSeats, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movie_id: details.movieId,
          showtime: details.showtime,
          seats: Array.isArray(details.seats) ? details.seats.join(',') : details.seats,
          total_amount: details.totalAmount,
          contact_number: details.contactNumber,
        }),
      });

      const data = await response.json();

      if (data.success || data.status === "success") {
        setBookingDetails(details);
        setView('receipt');
      } else {
        alert(`Booking failed: ${data.error || data.message}`);
      }
    } catch (error) {
      console.error("Error booking seats:", error);
      alert("Error booking seats. Please try again.");
    }
  };

  const renderView = () => {
    switch (view) {
      case 'home':
        return (
          <HomePage
            movies={movies}
            onSelectMovie={handleSelectMovie}
            onAddMovie={handleAddMovie}
            onEditMovie={handleEditMovie}
            onDeleteMovie={handleDeleteMovie}
          />
        );
      case 'booking':
        return (
          <BookingPage
            movie={selectedMovie}
            onConfirmBooking={handleConfirmBooking}
            onGoBack={() => setView('home')}
          />
        );
      case 'receipt':
        return (
          <ReceiptPage
            bookingDetails={bookingDetails}
            onGoHome={() => {
              setView('home');
              setSelectedMovie(null);
              setBookingDetails(null);
            }}
          />
        );
      case 'management':
        return (
          <MovieManagement
            movies={movies}
            onMoviesUpdate={fetchMovies}
            onGoBack={() => setView('home')}
          />
        );
      default:
        return <HomePage movies={movies} onSelectMovie={handleSelectMovie} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => setView('home')}
            className="text-xl font-bold text-indigo-400 hover:text-indigo-300"
          >
            Online Movie Ticket Booking
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => setView('home')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'home' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setView('management')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'management' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              Manage Movies
            </button>
          </div>
        </div>
      </nav>
      {renderView()}
    </div>
  );
};

export default App;
