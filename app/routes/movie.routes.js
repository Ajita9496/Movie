const { authJwt } = require("../middlewares");
const controller = require("../controllers/movie.controller");

module.exports = function (app) {
  app.get("/api/movies", controller.getMovies);

  app.post(
    "/api/movie/create",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.createMovie
  );

  app.put(
    "/api/movie/update/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateMovie
  );

  app.delete(
    "/api/movie/delete/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteMovie
  );

};
