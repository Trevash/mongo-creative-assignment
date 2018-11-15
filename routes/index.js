var express = require('express');
var router = express.Router();
let request = require('request');
var mongoose = require('mongoose');
let Movie = mongoose.model('Movie');

let tmdbKey = process.env['TMDBKEY'];

router.get('/allMovies', function(req, res, next) { // returns all movies to page
    Movie.find(function(err, movies){
        if(err){return next(err);}
        res.json(movies)
    })
})

router.get('/favorites/movies', function(req, res, next) { // Returns json formatted list of favorited movies
    let userName = req.cookies.name;
    Movie.find({userName: userName}, function(err, response) {
        if (err) return console.error(err);
        console.log(response);

        res.json(response[0].Movies);
    })
})

router.get('/favorites', function(req, res, next) { // Returns the favorites html page -- User should be logged in before getting here -- Could just set an angular variable to effectively use a new page. Can use if you want

    console.log(req.cookies.name);
    res.sendFile('favorites.html', { root: 'public' });
})

router.put('/favorites', function(req, res, next) { // Adds movie to list of favorites
    let userName = req.cookies.name;
    Movie.find({userName: userName}, function(err, response) {
        if (err) return console.error(err);
        if (response.length === 0) {
            let newFavorite = new Movie({
                userName: userName,
                Movies: [
                    req.body
                ]
            })
            newFavorite.save(function(err, post) {
              if (err) return console.error(err);
              console.log(post);
              res.sendStatus(200);
            });
        }
        else {
            let movieList = response[0].Movies;
            movieList.push(req.body);
            response[0].set({Movies: movieList});
            response[0].save(function (err, updatedMovieList) {
                if (err) return next(err);
                console.log(updatedMovieList)
                res.sendStatus(200);
              });
        }
    })
})

router.delete('/favorites/:name', function(req, res, next) { // Removes favorited movie from mongo table for logged in user
    let movieName = req.params.name;
    let userName = req.cookies.name;


    res.send(204);
})

router.get('/getmovies/:movieName', function(req, res, next) {
    let searchParam = req.params.movieName;
    let assembledMovies = [];
    request('http://api.themoviedb.org/3/search/movie/?api_key=81bd0d6b34320f2063b739e4196079f1&query=' + searchParam, function(error, response, body) {
        if (error) {
            next(new Error('Error requesting movies from external api:', error));
        }
        let jsonBody = JSON.parse(body);
        for (let i = 0; i < jsonBody.results.length; i++) {
            let title = jsonBody.results[i].title
            let imageUrl = "http://image.tmdb.org/t/p/w200" + jsonBody.results[i].poster_path;
            assembledMovies.push({
                title: title,
                imageUrl: imageUrl
            })
            let movie = new Movie({ title: title, imageUrl: imageUrl });
            movie.save(function(err, move) {
                if (err) { return next(err); }
            })
        }

        res.status(200).send(assembledMovies);
    })
})


router.get('/', function(req, res, next) {
    res.sendFile('index.html', { root: 'public' });
});

router.delete('/favorites', function(req, res, next) {
    Movie.find().remove(function(){});
    res.sendStatus(204);
})

module.exports = router;
