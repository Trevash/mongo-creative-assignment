var mongoose = require("mongoose")
var movieSchema = mongoose.Schema({
    userName: String,
    Movies: [
        {
            title: String,
            imageUrl: String,
        }
    ]
});

mongoose.model('Movie', movieSchema);