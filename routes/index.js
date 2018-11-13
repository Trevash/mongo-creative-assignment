var express = require('express');
var router = express.Router();

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

router.delete('/favorites/:name', function(req, res, next) {
    // Search mongo table Movie for movie with name matching path param
    let movieName = req.params.name;

    res.send(204);
})

router.put('/favorites', function(req, res, next) {
    // Return the list of saved movies based on specific user -> Should user be required to login before getting to this page?
    res.send(200);
})

router.get('/favorites', function(req, res, next) {
    res.sendFile('favorites.html', { root: 'public' });
})

router.get('/', function(req, res, next) {
    if (req.query.s) {
        console.log("query parameter s not empty, val is:", req.query.s);
        // Search external URL and return data -- Though this may just be handled on the frontend...
    }
    res.sendFile('index.html', { root: 'public' });
});

module.exports = router;
