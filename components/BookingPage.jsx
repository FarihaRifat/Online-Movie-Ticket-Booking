import React, { useState } from 'react';
import { SeatStatus } from '../types.js';
import { ChevronLeftIcon, TicketIcon, PhoneIcon, ArmchairIcon } from './icons.jsx';

const SeatComponent = ({ seat, onSelect }) => {
  const getSeatClass = (status) => {
    switch (status) {
      case SeatStatus.Available:
        return 'bg-gray-600 hover:bg-indigo-500 cursor-pointer text-gray-300';
      case SeatStatus.Selected:
        return 'bg-green-500 cursor-pointer text-white';
      case SeatStatus.Booked:
        return 'bg-gray-800 cursor-not-allowed text-gray-500';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div
      onClick={() =>
        (seat.status === SeatStatus.Available || seat.status === SeatStatus.Selected)
          ? onSelect(seat.id)
          : null
      }
      className={`w-6 h-6 md:w-8 md:h-8 rounded-t-md transition-colors duration-200 flex items-center justify-center font-mono text-xs md:text-sm select-none ${getSeatClass(seat.status)}`}
      title={seat.id}
    >
      {seat.status === SeatStatus.Booked ? <ArmchairIcon className="w-4 h-4 opacity-50"/> : seat.id}
    </div>
  );
};

const BookingPage = ({ movie, onConfirmBooking, onGoBack }) => {
  const [activeShowtime, setActiveShowtime] = useState(null);
  const [seats, setSeats] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [contactNumber, setContactNumber] = useState('');
  const [error, setError] = useState('');

  const handleShowtimeSelect = (showtime) => {
    setActiveShowtime(showtime);
    const initialSeats = showtime.seats.map(row => row.map(seat => ({ ...seat })));
    setSeats(initialSeats);
    setSelectedSeats([]);
    setError('');
  };

  const handleSelectSeat = (seatId) => {
    if (!seats) return;

    const newSeats = seats.map(row => row.map(seat => ({ ...seat })));
    const row = seatId.charCodeAt(0) - 65; // 'A' -> 0
    const col = parseInt(seatId.substring(1), 10) - 1; // '1' -> 0
    const seat = newSeats[row][col];

    if (seat.status === SeatStatus.Available) {
      seat.status = SeatStatus.Selected;
      setSelectedSeats([...selectedSeats, seat]);
    } else if (seat.status === SeatStatus.Selected) {
      seat.status = SeatStatus.Available;
      setSelectedSeats(selectedSeats.filter(s => s.id !== seatId));
    }
    setSeats(newSeats);
  };

  const totalAmount = selectedSeats.length * (movie.price || 0);

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat.');
      return;
    }
    if (!contactNumber.trim() || !/^\d{10,}$/.test(contactNumber.trim())) {
      setError('Please enter a valid contact number (at least 10 digits).');
      return;
    }
    if (!activeShowtime) {
      setError('An unexpected error occurred. Please select a showtime again.');
      return;
    }
    setError('');
const bookingDetails = {
  movieId: movie.id,   // add this
  movieTitle: movie.title,
  posterUrl: movie.posterUrl,
  showtime: activeShowtime.time,
  seats: selectedSeats.map(s => s.id),
  totalAmount,
  contactNumber,
};

    onConfirmBooking(bookingDetails);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col">
      <header className="relative flex items-center mb-8">
        <button onClick={onGoBack} className="absolute left-0 p-2 rounded-full hover:bg-gray-700 transition-colors">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <div className="text-center flex-grow">
          <h1 className="text-2xl md:text-3xl font-bold">{movie.title}</h1>
          {activeShowtime && <p className="text-gray-400">{activeShowtime.time}</p>}
        </div>
      </header>

      {!activeShowtime ? (
        <div className="flex flex-col items-center justify-center flex-grow">
          <h2 className="text-2xl font-semibold mb-6 text-gray-300">Select a Showtime</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {movie.showtimes.map(st => (
              <button
                key={st.time}
                onClick={() => handleShowtimeSelect(st)}
                className="px-6 py-3 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg"
              >
                {st.time}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-grow flex flex-col lg:flex-row gap-8">
          <div className="flex-grow flex flex-col items-center">
            <div className="w-full max-w-xl mb-4">
              <div className="bg-gray-800 h-2 rounded-full mb-1"></div>
              <div className="text-center text-sm text-gray-400">SCREEN</div>
            </div>
            {seats && (
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${seats[0].length}, minmax(0, 1fr))` }}
              >
                {seats.flat().map(seat => (
                  <SeatComponent key={seat.id} seat={seat} onSelect={handleSelectSeat} />
                ))}
              </div>
            )}
            <div className="flex justify-center gap-4 mt-8">
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-600 rounded-t-sm"></div><span className="text-xs">Available</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded-t-sm"></div><span className="text-xs">Selected</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-800 rounded-t-sm"></div><span className="text-xs">Booked</span></div>
            </div>
            <button onClick={() => setActiveShowtime(null)} className="mt-6 text-sm text-indigo-400 hover:text-indigo-300 underline">
              Change Showtime
            </button>
          </div>

          <div className="w-full lg:w-80 lg:min-w-[320px] bg-gray-800/50 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Booking Summary</h2>
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-300">Selected Seats</h3>
                <p className="text-indigo-400 font-mono text-sm break-words">
                  {selectedSeats.length > 0 ? selectedSeats.map(s => s.id).join(', ') : 'None'}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-300">Total Price</h3>
                <p className="text-2xl font-bold text-green-400">${totalAmount.toFixed(2)}</p>
              </div>
              <div>
                <label htmlFor="contact" className="font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4" />Contact Number
                </label>
                <input
                  type="tel"
                  id="contact"
                  value={contactNumber}
                  onChange={e => setContactNumber(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mt-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                  placeholder="e.g., 1234567890"
                />
              </div>
            </div>
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <button
              onClick={handleBooking}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-semibold transition-all duration-300 hover:bg-green-500 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
              disabled={selectedSeats.length === 0 || !contactNumber}
            >
              <TicketIcon className="w-5 h-5"/>
              Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
