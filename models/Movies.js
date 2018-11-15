var mongoose = require("mongoose")
var movieSchema = mongoose.Schema({
    userName: String,
    Movies: [
        {
            name: String,
            imageUrl: String,
        }
    ]
});

mongoose.model('Movie', movieSchema);