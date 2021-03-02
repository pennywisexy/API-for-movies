const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();
const jsonParser = express.json();
const bcrypt = require('bcryptjs');

const Movie = require('./models/movie');
const User = require('./models/user');

app.use(express.static(__dirname + "/public"));

app.use(session({
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false
}))

app.get("/api/movies", async function (req, res) {
  const movies = await Movie.find();
  res.send(movies);
});

app.get("/api/movies/:id", async function (req, res) {
  const id = req.params.id;
  const movie = await Movie.findById(id);
  if (movie) {
    res.send(movie);
  } else {
    res.status(404).send();
  }
});

app.get("/api/users/:id", async function (req, res) {
  const id = req.params.id;
  const user = await User.findById(id);
  if (user) {
    res.send(user);
  } else {
    res.status(404).send();
  }
});

app.post("/api/movies", async function (req, res) {

  if (!req.body) return res.sendStatus(400);

  const movie = new Movie({
    title: req.body.title,
    description: req.body.description,
    sources: req.body.sources,
    subtitle : req.body.subtitle,
    thumb: req.body.thumb,
    ratingValue: req.body.ratingValue
  })
  try {
    await movie.save();
    res.send(movie);
  } catch (e) {
    console.log(e);
  }
});

app.post('/api/movies/edit', jsonParser, async (req, res) => {
  const {_id} = req.body;
  delete req.body._id;
  await Movie.findByIdAndUpdate(_id, req.body);
})

app.post('/register', async (req, res) => {
  try {
    const {email, password, firstName, lastName} = req.body;
    const candidate = await User.findOne({email});

    if (candidate) {
      console.log('User already created')
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email, password: hashPassword, firstName, lastName
      })

      await user.save();
    }
  } catch (e) {
    console.log(e);
  }
})

app.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;

    const candidate = await User.findOne({email});

    if (candidate) {
      const isSame = await bcrypt.compare(password, candidate.password);

      if (isSame) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save(err => {
          if (err) {
            throw err;
          }
        })
      } else {
        console.log('Wrong log');
      }
    } else {
      console.log('User is not found');
    }
  } catch (e) {
    console.log(e);
  }
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


