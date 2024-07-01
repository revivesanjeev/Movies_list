import React, { useState } from "react";
import "./AddMovieForm.css";

const AddMovieForm = () => {
  const [isFormVisible, setFormVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [openingText, setOpeningText] = useState("");
  const [releaseDate, setReleaseDate] = useState("");

  const handleButtonClick = (event) => {
    if (isFormVisible) {
     
      event.preventDefault();
     
      console.log(title, openingText, releaseDate);

      setTitle("");
      setOpeningText("");
      setReleaseDate("");
      setFormVisible(false);
    } else {
     
      setFormVisible(true);
    }
  };

  return (
    <div>
      <div className={`form ${isFormVisible ? "visible" : ""}`}>
        <h3>Title</h3>
        <input
          type="text"
          placeholder="Movies Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <h3>Opening Text</h3>
        <input
          type="text"
          placeholder="Opening Text"
          value={openingText}
          onChange={(e) => setOpeningText(e.target.value)}
        />
        <h3>Release Date</h3>
        <input
          type="date"
          placeholder="release date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
        />
      </div>
      <button className="add-movie-button" onClick={handleButtonClick}>
        {isFormVisible ? "Submit Movie" : "Add Movie"}
      </button>
    </div>
  );
};

export default AddMovieForm;
