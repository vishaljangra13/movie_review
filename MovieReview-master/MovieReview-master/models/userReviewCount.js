const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userReviewCountSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    reviewArray: {
        type: Array,
        of: String
    },
    ratingArray: {
        type: Array, 
        of: Number
    },
    imdbIdArray:{
        type: Array, 
        of: String
    },
    movieNameArray: {
        type: Array
        // of: String
    }
});

module.exports = mongoose.model('UserReviewCountModel', userReviewCountSchema);