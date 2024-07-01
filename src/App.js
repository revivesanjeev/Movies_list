import React, { useState, useEffect, useCallback } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovieForm from "./components/AddMovieForm";


function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(false);
  const [retryTimer, setRetryTimer] = useState(null);
 
 const addMovieHandler=(movie)=>{
  setMovies((prevMovies)=>[...prevMovies,movie]);
 };
  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://swapi.dev/api/films/");
      if (!response.ok) {
        throw new Error("Something went wrong! Retrying...");
      }

      const data = await response.json();

      const transformedMovies = data.results.map((movieData) => ({
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date,
      }));
      setMovies(transformedMovies);
      setRetry(false); 
      setIsLoading(false); 
    } catch (error) {
      setError(error.message);
      setRetry(true); 
      setIsLoading(true); 
    }
  }, []);

 
  useEffect(() => {
    fetchMoviesHandler(); 
  }, [fetchMoviesHandler]);

  useEffect(() => {
    if (retry) {
      const timer = setTimeout(() => {
        fetchMoviesHandler();
      }, 5000); 
      setRetryTimer(timer);
    }
    return () => {
      if (retryTimer) {
        clearTimeout(retryTimer); 
      }
    };
  }, [retry, fetchMoviesHandler, retryTimer]);

  const cancelRetryHandler = () => {
    setRetry(false);
    setIsLoading(false); 
    if (retryTimer) {
      clearTimeout(retryTimer); 
    }
  };

  let content = <p>Found no Movies</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = (
      <div>
        <p>
          {error} <strong>Retrying...</strong>
        </p>
        <button onClick={cancelRetryHandler}>Cancel</button>
      </div>
    );
  }

  if (isLoading) {
    content = (
      <div>
        <div className="loader"></div>
        <button onClick={cancelRetryHandler}>Cancel</button>
      </div>
    ); 
  }

  return (
    <React.Fragment>
      <section>
        <AddMovieForm onAddMovie={addMovieHandler} />
      </section>
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
