import React, { useState, useEffect } from 'react';

const MovieForm = ({ movie = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: movie?.title || '',
    description: movie?.description || '',
    posterUrl: movie?.posterUrl || '',
    price: movie?.price || 0,
  });

  useEffect(() => {
    if (movie && movie.id) {
      setFormData({
        title: movie.title || '',
        description: movie.description || '',
        posterUrl: (movie.posterUrl || '').trim(),
        price: movie.price ? parseFloat(movie.price) : 0,
      });
    } else {
      setFormData({ title: '', description: '', posterUrl: '', price: 0 });
    }
  }, [movie]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const submitData = {
        title: (formData.title || '').trim(),
        description: (formData.description || '').trim(),
        posterUrl: (formData.posterUrl || '').trim(),
        price: parseFloat(formData.price) || 0,
      };
      
      if (!submitData.title) {
        alert('Title is required');
        return;
      }
      if (!submitData.description) {
        alert('Description is required');
        return;
      }
      if (!submitData.posterUrl) {
        alert('Poster URL is required');
        return;
      }
      
      if (submitData.price < 0) {
        alert('Price must be a positive number');
        return;
      }
      
      if (onSubmit) {
        onSubmit(submitData);
      }
      if (!movie) {
        setFormData({ title: '', description: '', posterUrl: '', price: 0 });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="3"
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Poster URL</label>
        <input
          type="url"
          required
          value={formData.posterUrl}
          onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
        <input
          type="number"
          required
          min="0"
          step="0.01"
          value={formData.price}
          onChange={(e) => {
            const value = e.target.value;
            const numValue = value === '' ? 0 : parseFloat(value);
            setFormData({ ...formData, price: isNaN(numValue) ? 0 : numValue });
          }}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 transition-colors"
        >
          {movie ? 'Update' : 'Add'} Movie
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-500 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default MovieForm;
