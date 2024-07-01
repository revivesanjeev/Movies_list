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

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://movieslistnew-745ad-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong! Retrying...");
      }

      const data = await response.json();

       const transformedMovies = [];
       for (const key in data) {
         transformedMovies.push({
           id: key,
           title: data[key].title,
           openingText: data[key].openingText,
           releaseDate: data[key].releaseDate,
         });
       }
      setMovies(transformedMovies);
      setRetry(false);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setRetry(true);
      setIsLoading(true);
    }
  }, []);

   async function moviesDeleteHandler(movieId) {
     try {
       const response = await fetch(
         `https://movieslistnew-745ad-default-rtdb.firebaseio.com/movies/${movieId}.json`,
         {
           method: "DELETE",
         }
       );
       if (!response.ok) {
         throw new Error("Failed to delete the movie.");
       }
       setMovies((prevMovies) =>
         prevMovies.filter((movie) => movie.id !== movieId)
       );
     } catch (error) {
       setError(error.message);
     }
   }



  async function addMovieHandler(movie) {
   const response=await  fetch(
      "https://movieslistnew-745ad-default-rtdb.firebaseio.com/movies.json",
      {
        method: 'POST',
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
    fetchMoviesHandler();
  }

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
    content = (
      <MoviesList movies={movies} onDeleteMovie={moviesDeleteHandler} />
    );
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
