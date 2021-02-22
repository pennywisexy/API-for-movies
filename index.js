const express = require("express");
const mongoose = require("mongoose");
const app = express();
const jsonParser = express.json();
const Movie = require('./models/movie')
app.use(express.static(__dirname + "/public"));

app.get("/api/movies", async function (req, res) {
  const movies = await Movie.find();
  res.send(movies);
});

app.get("/api/movies/:id", async function (req, res) {
  console.log(req.params)

  const id = req.params.id;
  const movie = await Movie.findById(id);
  if (movie) {
    res.send(movie);
  } else {
    res.status(404).send();
  }
});

app.post("/api/movies", async function (req, res) {
  // console.log(req.body)

  if (!req.body) return res.sendStatus(400);

  const movie = new Movie({
    title: req.body.title,
    description: req.body.description,
    sources: req.body.sources,
    subtitle : req.body.subtitle,
    thumb: req.body.thumb
  })
  try {
    await movie.save();
    res.send(movie);
  } catch (e) {
    console.log(e);
  }
});

app.post('/api/movies/edit', jsonParser, async (req, res) => {
  const {id} = req.body;
  delete req.body.id;
  await Movie.findByIdAndUpdate(id, req.body, {useFindAndModify: false});
  console.log('req.bodyreq.bodyreq.bodyreq.bodyreq.bodyreq.body')
  console.log(req.body)
})

app.put("/api/movies", jsonParser, async function (req, res) {

  const {id} = req.body;
  delete req.body.id;

  if (!req.body) return res.sendStatus(400);

  await Movie(id, req.body);
});

async function start() {
  try {
  const url = 'mongodb+srv://hero:123456qwerty@cluster0.qxjxl.mongodb.net/movies';

  await mongoose.connect(url, {
    useNewUrlParser: true,
    useFindAndModify: false
  });
  app.listen(3000, function () {
    console.log("Server is running on port: 3000");
  });
  } catch (e) {
    console.log(e);
  }

}
start();
