var express = require('express');
var router = express.Router();
let request = require('request');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/movieDB',{ useNewUrlParser: true });

var movieSchema = mongoose.Schema({
    userName: String,
    Movies: [
        {
            name: String,
            imageUrl: String,
            rating: Number
        }
    ]
});

var Movie = mongoose.model('Movie', movieSchema);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected');
});

let tmdbKey = process.env['TMDBKEY'];

router.get('/favorites/movies', function(req, res, next) { // Returns json formatted list of favorited movies

})

router.get('/favorites', function(req, res, next) { // Returns the favorites html page -- User should be logged in before getting here -- Could just set an angular variable to effectively use a new page. Can use if you want
    console.log(req.cookies.name);
    res.sendFile('favorites.html', { root: 'public' });
})

router.put('/favorites', function(req, res, next) { // Adds movie to list of favorites
    res.send(200);
})

router.delete('/favorites/:name', function(req, res, next) { // Removes favorited movie from mongo table for logged in user
    let movieName = req.params.name;

    res.send(204);
})

router.get('/getmovies/:movieName', function(req, res, next) {
    let searchParam = req.params.movieName;
    let assembledMovies = [];
    request('http://api.themoviedb.org/3/search/movie/?api_key=81bd0d6b34320f2063b739e4196079f1&query='+searchParam, function(error, response, body) {
        if (error) {
            next(new Error('Error requesting movies from external api:', error));
        }
        let jsonBody = JSON.parse(body);
        for (let i = 0; i < jsonBody.results.length; i++) {
            let title = jsonBody.results[i].title
            let imageUrl = "http://image.tmdb.org/t/p/w200"+jsonBody.results[i].poster_path;
            assembledMovies.push({
                title: title,
                imageUrl: imageUrl
            })
        }

        res.status(200).send(assembledMovies);
    })
})


router.get('/', function(req, res, next) {
    res.sendFile('index.html', { root: 'public' });
});

module.exports = router;
