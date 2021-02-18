const express = require("express");
const fs = require("fs");
    
const app = express();
const jsonParser = express.json();
  
app.use(express.static(__dirname + "/public"));

const filePath = "data.json";

app.get("/api/movies", function(req, res){
       
    const content = fs.readFileSync(filePath,"utf8");
    const dataMovies = JSON.parse(content);
    const movies = dataMovies.categories[0].videos;
    res.send(movies);
});

app.get("/api/users/:id", function(req, res){
    const title = req.params.title;
    const content = fs.readFileSync(filePath, "utf8");
    const dataMovies = JSON.parse(content);
    const movies = dataMovies.categories[0].videos;
    let movie = null;

    for(let i = 0; i < movies.length; i++){
        if(movies[i]['title'] === title){
            movie = movies[i];
            break;
        }
    }

    if(movie){
        res.send(movies);
    }
    else{
        res.status(404).send();
    }
});

app.post("/api/movies", jsonParser, function (req, res) {
      
    if(!req.body) return res.sendStatus(400);
      
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
        title: movieTitle
    };
      
    let data = fs.readFileSync(filePath, "utf8");
    const dataMovies = JSON.parse(data);
    const movies = dataMovies.categories[0].videos;

    movies.unshift(movie);
    data = JSON.stringify(movies);

    fs.writeFileSync("data.json", data);
    res.send(dataMovies);
});
   
app.listen(3000, function(){
    console.log("Waiting to connect...");
});
