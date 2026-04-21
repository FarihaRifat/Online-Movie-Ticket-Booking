import React, { useState } from 'react';
import MovieForm from './MovieForm.jsx';

const MovieCard = ({ movie, onBookNow, onEdit, onDelete }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!movie) {
    return <div className="bg-gray-800 rounded-lg p-4">No movie data available</div>;
  }

  const handleEdit = async (updatedData) => {
    if (!movie || !movie.id) {
      alert('Invalid movie data. Cannot edit.');
      return;
    }
    try {
      const result = await onEdit(movie.id, updatedData);
      if (result && result.success) {
        setShowEditForm(false);
      }
    } catch (error) {
      console.error('Error updating movie:', error);
      alert('Failed to update movie. Please check the console for details.');
    }
  };

  const handleDelete = () => {
    if (!movie || !movie.id) {
      alert('Invalid movie data. Cannot delete.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${movie.title || 'this movie'}"?`)) {
      onDelete(movie.id);
    }
  };

  if (showEditForm) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 border-2 border-indigo-500 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Edit Movie: {movie?.title || 'Untitled'}</h3>
          <button
            onClick={() => setShowEditForm(false)}
            className="text-gray-400 hover:text-white text-xl cursor-pointer"
            title="Close"
            type="button"
          >
            ×
          </button>
        </div>
        <MovieForm 
          key={movie.id} 
          movie={movie} 
          onSubmit={handleEdit} 
          onCancel={() => setShowEditForm(false)} 
        />
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/30 group">
      <div className="relative">
        <img
          src={imageError || !movie?.posterUrl ? 'https://via.placeholder.com/500x750?text=No+Image' : (movie.posterUrl || '').trim()}
          alt={movie?.title || 'Movie Poster'}
          className="w-full h-96 object-cover"
          onError={() => setImageError(true)}
          onLoad={() => setImageError(false)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-xl font-bold text-white truncate group-hover:underline">
            {movie?.title || 'Untitled Movie'}
          </h3>
        </div>
        {onEdit && onDelete && (
          <div className="absolute top-2 right-2 flex gap-2 z-20">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowEditForm(true);
              }}
              className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 active:bg-blue-700 transition-colors shadow-lg cursor-pointer z-20"
              title="Edit Movie"
              type="button"
              aria-label="Edit Movie"
            >
              ✏️
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete();
              }}
              className="p-2 bg-red-600 text-white rounded-md hover:bg-red-500 active:bg-red-700 transition-colors shadow-lg cursor-pointer z-20"
              title="Delete Movie"
              type="button"
              aria-label="Delete Movie"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-gray-400 text-sm mb-2">Price: ${movie?.price ? movie.price.toFixed(2) : '0.00'}</p>
        <p className="text-gray-400 text-sm mb-4 h-20 overflow-hidden">
          {movie?.description || 'No description available.'}
        </p>
        <button
          onClick={() => onBookNow(movie)}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-semibold transition-all duration-300 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
