import React from 'react';
import { CalendarIcon, ClockIcon, ArmchairIcon, HashIcon, PhoneIcon, FilmIcon, CheckCircleIcon } from './icons.jsx';

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 w-6 h-6 text-indigo-400">{icon}</div>
    <div className="ml-3">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="font-semibold text-white">{value}</p>
    </div>
  </div>
);

const ReceiptPage = ({ bookingDetails, onGoHome }) => {
  if (!bookingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-300">No booking details available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/20 rounded-full"></div>
        <div className="absolute -bottom-16 -left-12 w-40 h-40 bg-purple-500/20 rounded-full"></div>
        
        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">Booking Confirmed!</h1>
          <p className="text-gray-400">Thank you for your purchase.</p>
        </div>

        {/* Booking summary */}
        <div className="bg-gray-900/50 p-6 rounded-lg mb-8 relative z-10">
          <div className="flex items-center mb-6">
            <img
              src={bookingDetails.posterUrl}
              alt={bookingDetails.movieTitle}
              className="w-20 h-28 object-cover rounded-md mr-4 shadow-lg"
            />
            <div>
              <h2 className="text-xl font-bold text-white">{bookingDetails.movieTitle}</h2>
              {/* Use totalAmount instead of totalPrice */}
              <p className="text-lg font-semibold text-indigo-400">
                ${bookingDetails.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
          
          <div className="space-y-5 border-t border-gray-700 pt-5">
            <DetailItem icon={<CalendarIcon />} label="Date" value={new Date().toLocaleDateString()} />
            <DetailItem icon={<ClockIcon />} label="Showtime" value={bookingDetails.showtime} />
            <DetailItem icon={<ArmchairIcon />} label="Seats" value={bookingDetails.seats.join(', ')} />
            <DetailItem icon={<HashIcon />} label="Total Tickets" value={bookingDetails.seats.length} />
            <DetailItem icon={<PhoneIcon />} label="Contact Number" value={bookingDetails.contactNumber} />
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onGoHome}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-semibold transition-colors duration-300 hover:bg-indigo-500 flex items-center justify-center gap-2 relative z-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
        >
          <FilmIcon className="w-5 h-5" />
          Book Another Movie
        </button>
      </div>
    </div>
  );
};

export default ReceiptPage;
