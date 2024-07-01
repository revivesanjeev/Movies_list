import React from 'react';
import './Movie.css'

import classes from './Movie.module.css';

const Movie = (props) => {
const deleteMovieHandler=()=>{
  props.onDeleteMovie(props.id);
};
  return (
    <li className={classes.movie}>
      <h2>{props.title}</h2>
      <h3>{props.releaseDate}</h3>
      <p>{props.openingText}</p>
      <button className="delete-button"onClick={deleteMovieHandler}>Delete</button>
    </li>
  );
};

export default Movie;
