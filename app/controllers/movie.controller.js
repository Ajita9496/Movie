const db = require("../models");
const Movie = db.movie;

exports.createMovie = (req, res) => {
  const { title, image, rating, description } = req.body;

  const movie = new Movie({
    title,
    image,
    rating,
    description
  });

  movie.save((err, savedMovie) => {
    if (err) {
      console.error("Error saving movie:", err);
      res.status(500).send({ message: "An error occurred while saving the movie." });
      return;
    }
    res.send({ message: "Movie created successfully!", movie: savedMovie });
  });
};

exports.getMovies = (req, res) => {
  Movie.find({}, (err, movies) => {
    if (err) {
      console.error("Error retrieving movies:", err);
      res.status(500).send({ message: "An error occurred while retrieving movies." });
      return;
    }

    if (movies.length === 0) {
      res.status(404).send({ message: "No movies found." });
      return;
    }

    res.send(movies);
  });
};

exports.deleteMovie = (req, res) => {
  const movieId = req.params.id;

  Movie.findByIdAndRemove(movieId, (err, deletedMovie) => {
    if (err) {
      console.error("Error deleting movie:", err);
      res.status(500).send({ message: "An error occurred while deleting the movie." });
      return;
    }

    if (!deletedMovie) {
      res.status(404).send({ message: "Movie not found." });
      return;
    }

    res.send({ message: "Movie deleted successfully!" });
  });
};

exports.updateMovie = (req, res) => {
  const movieId = req.params.id;
  const updatedMovie = req.body;

  Movie.findByIdAndUpdate(
    movieId,
    updatedMovie,
    { new: true },
    (err, updatedMovie) => {
      if (err) {
        console.error("Error updating movie:", err);
        res.status(500).send({ message: "An error occurred while updating the movie." });
        return;
      }
      if (!updatedMovie) {
        res.status(404).send({ message: "Movie not found." });
        return;
      }
      res.send({ message: "Movie updated successfully!", movie: updatedMovie });
    }
  );
};
