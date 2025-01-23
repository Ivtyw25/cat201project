import React, { useState } from 'react';
import axios from 'axios';

function MovieSearch() {
  const [movieData, setMovieData] = useState([]);  // Store all movies
  const [error, setError] = useState('');  // Store any error messages

  const handleFetchMovies = async () => {
    try {
      // Make a GET request to the servlet to fetch all movies
      const response = await axios.get('http://localhost:8080/cat201project_war/itemServlet');

      const data = response.data;

      if (data.error) {
        setError(data.error);
        setMovieData([]);
      } else {
        setMovieData(data);  // Store the fetched movie data
        setError('');
      }
    } catch (err) {
      setError('Error fetching data');
      setMovieData([]);
    }
  };

  return (
    <div>
      <h1>Movie Search</h1>

      <button onClick={handleFetchMovies}>Fetch All Movies</button>

      {error && <p>{error}</p>}  {/* Display error message if any */}
      
      <div>
        {movieData.length > 0 ? (
          movieData.map((movie, index) => (
            <div key={index} style={{ margin: '10px', border: '1px solid #ddd', padding: '10px' }}>
              <h3>{movie.title} ({movie.year})</h3>
              <p>{movie.plot}</p>
            </div>
          ))
        ) : (
          <p>No movies to display</p>
        )}
      </div>
    </div>
  );
}

export default MovieSearch;
