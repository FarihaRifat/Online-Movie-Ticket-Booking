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

  const DEFAULT_SHOWTIMES = ["12:00 PM", "04:00 PM", "08:00 PM"]; // Bangladesh Time (UTC+6)

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
        fetchMovies(); // Refresh movie list
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
        await fetchMovies(); // Refresh movie list
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
        fetchMovies(); // Refresh movie list
      } else {
        alert(`Failed to delete movie: ${data.error || data.message}`);
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("Error deleting movie. Please try again.");
    }
  };

  // Confirm booking and then show receipt
  const handleConfirmBooking = async (details) => {
    try {
      const response = await fetch(API_ENDPOINTS.bookSeats, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: details.movieId,
          showtime: details.showtime,
          seats: details.seats,
          totalAmount: details.totalAmount,
          contactNumber: details.contactNumber,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        console.log("Booking successful:", data);

        // Save booking details for ReceiptPage
       setBookingDetails({
  bookingId: data.bookingId,
  movieTitle: details.movieTitle,
  posterUrl: details.posterUrl,
  showtime: details.showtime,
  seats: details.seats,
  totalAmount: details.totalAmount,
  contactNumber: details.contactNumber,
});


        // Switch view to receipt
        setView("receipt");
      } else {
        console.error("Booking failed:", data.message);
        alert(`Booking failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error booking seats:", error);
      alert("Error booking seats. Please try again.");
    }
  };

  const handleGoHome = () => {
    setSelectedMovie(null);
    setBookingDetails(null);
    setView('home');
  };

  const renderView = () => {
    switch (view) {
      case 'booking':
        return selectedMovie && (
          <BookingPage
            movie={selectedMovie}
            onConfirmBooking={handleConfirmBooking}
            onGoBack={handleGoHome}
          />
        );
      case 'receipt':
        return bookingDetails && (
          <ReceiptPage bookingDetails={bookingDetails} onGoHome={handleGoHome} />
        );
      case 'management':
        return (
          <MovieManagement 
            movies={movies} 
            onMoviesUpdate={fetchMovies}
            onGoBack={handleGoHome}
          />
        );
      default:
        return movies.length === 0
          ? <p className="text-center mt-10">Loading movies...</p>
          : (
            <>
              <div className="container mx-auto px-4 pt-4 flex justify-end">
                <button
                  onClick={() => setView('management')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                >
                  Manage Movies
                </button>
              </div>
              <HomePage 
                movies={movies} 
                onSelectMovie={handleSelectMovie}
                onAddMovie={handleAddMovie}
                onEditMovie={handleEditMovie}
                onDeleteMovie={handleDeleteMovie}
              />
            </>
          );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-slate-800 text-gray-100 font-sans">
      <main>{renderView()}</main>
    </div>
  );
};

export default App;
