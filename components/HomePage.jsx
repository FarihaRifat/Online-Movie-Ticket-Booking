import React, { useState, useMemo } from 'react';
import MovieCard from './MovieCard.jsx';
import MovieForm from './MovieForm.jsx';
import { FilmIcon } from './icons.jsx';

const HomePage = ({ movies, onSelectMovie, onAddMovie, onEditMovie, onDeleteMovie }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleBookNow = (movie) => {
    onSelectMovie(movie);
  };

  const filteredMovies = useMemo(() => {
    if (!searchQuery.trim()) {
      return movies;
    }
    const query = searchQuery.toLowerCase();
    return movies.filter(movie => 
      movie.title?.toLowerCase().includes(query) ||
      movie.description?.toLowerCase().includes(query)
    );
  }, [movies, searchQuery]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-8 md:mb-12">
        <div className="flex justify-center items-center gap-4">
            <FilmIcon className="w-12 h-12 text-indigo-400" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                Amiyo Movie Theater 
            </h1>
        </div>
        <p className="mt-4 text-lg text-gray-400">Now Showing</p>
      </header>

      {/* Search Box and Add Movie Button */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between max-w-7xl mx-auto">
        <div className="w-full sm:w-2/3 relative">
          <input
            type="text"
            placeholder="Search movies by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-500 transition-colors"
        >
          {showAddForm ? 'Cancel' : '+ Add Movie'}
        </button>
      </div>

      {searchQuery && (
        <p className="mb-4 text-sm text-gray-400 text-center">
          Found {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Add Movie Form */}
      {showAddForm && (
        <div className="mb-6 p-6 bg-gray-800 rounded-lg border border-gray-700 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-white">Add New Movie</h2>
          <MovieForm
            onSubmit={(movieData) => {
              onAddMovie(movieData);
              setShowAddForm(false);
            }}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {filteredMovies.length > 0 ? (
          filteredMovies.map(movie => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onBookNow={handleBookNow}
              onEdit={onEditMovie}
              onDelete={onDeleteMovie}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400 text-lg">No movies found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
