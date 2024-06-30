import React, { useState, useEffect, useCallback } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(false);
  const [retryTimer, setRetryTimer] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://swapi.dev/api/flms/");
      if (!response.ok) {
        throw new Error("Something went wrong! Retrying...");
      }

      const data = await response.json();

      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);
      setRetry(false);
    } catch (error) {
      setError(error.message);
      setRetry(true); 
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (retry) {
      const timer = setTimeout(() => {
        fetchMoviesHandler();
      }, 5000); 
      setRetryTimer(timer);
    }
    return () => clearTimeout(retryTimer);
  }, [retry, fetchMoviesHandler, retryTimer]);

  const cancelRetryHandler = () => {
    setRetry(false);
    clearTimeout(retryTimer); 
  };

  let content = <p>Found no Movies</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = (
      <div>
        <p>
          {error.split("Retrying")[0]}
          <strong>Retrying...</strong>
        </p>
        <button onClick={cancelRetryHandler}>Cancel</button>
      </div>
    );
  }

  if (isLoading) {
    content = <div className="loader"></div>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler} disabled={isLoading || retry}>
          Fetch Movies
        </button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
