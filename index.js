const express = require("express");
const fs = require("fs");
const app = express();
const jsonParser = express.json();
app.use(express.static(__dirname + "/public"));

const filePath = "data.json";

app.get("/api/movies", function (req, res) {
  const content = fs.readFileSync(filePath, "utf8");
  const dataMovies = JSON.parse(content);
  const movies = dataMovies.categories[0].videos;
  res.send(movies);
});

app.get("/api/movies/:id", function (req, res) {
  const id = req.params.id;
  const content = fs.readFileSync(filePath, "utf8");
  const dataMovies = JSON.parse(content);
  const movies = dataMovies.categories[0].videos;
  let movie = null;

  for (let i = 0; i < movies.length; i++) {
    if (+movies[i].id === +id) {
      movie = movies[i];
      break;
    }
  }

  if (movie) {
    res.send(movie);
  } else {
    res.status(404).send();
  }
});

app.post("/api/movies", jsonParser, function (req, res) {

  if (!req.body) return res.sendStatus(400);

  const movieDescription = req.body.description;
  const movieSources = req.body.sources;
  const movieSubtitle = req.body.subtitle;
  const movieThumb = req.body.thumb;
  const movieTitle = req.body.title;
  let movie = {
    description: movieDescription,
    sources: [movieSources],
    subtitle: movieSubtitle,
    thumb: movieThumb,
    title: movieTitle,
  };
  let data = fs.readFileSync(filePath, "utf8");
  const dataMovies = JSON.parse(data);
  const movies = dataMovies.categories[0].videos;

  const id = Math.max.apply(
    Math,
    movies.map(function (item) {
      return +item.id;
    })
  );

  movie.id = id + 1;

  movies.unshift(movie);
  data = JSON.stringify(dataMovies);

  fs.writeFileSync("data.json", data);
  res.send(movie);
});

app.put("/api/movies", jsonParser, function (req, res) {
  if (!req.body) return res.sendStatus(400);

  const movieDescription = req.body.description;
  const movieSources = req.body.sources;
  const movieSubtitle = req.body.subtitle;
  const movieThumb = req.body.thumb;
  const movieTitle = req.body.title;
  const id = req.body.id;
  let data = fs.readFileSync(filePath, "utf8");
  const dataMovies = JSON.parse(data);
  const movies = dataMovies.categories[0].videos;
  let movie;

  for (let i = 0; i < movies.length; i++) {
    if (+movies[i].id === +id) {
      movie = movies[i];
      break;
    }
  }

  if (movie) {
    movie.description = movieDescription;
    movie.sources = movieSources;
    movie.subtitle = movieSubtitle;
    movie.thumb = movieThumb;
    movie.title = movieTitle;

    data = JSON.stringify(dataMovies);
    fs.writeFileSync("data.json", data);
    res.send(movie);
  } else {
    res.status(404).send(movie);
  }
});
app.listen(3000, function () {
  console.log("Waiting to connect...");
});
