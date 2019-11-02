const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aboutSchema = new Schema({
    userId:{
        type:String,
        required:true
    },
    about: {
        type: String,
        required: true,
        default:'About Info'
    },
    hobbies: {
        type: String,
        required: true,
        default: 'Hobbies Info'
    },
    favouriteMovies: {
        type: String,
        required: true,
        default: 'Favourite Movies Info'
    },
    noOfReviews:{
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('UserAboutModel', aboutSchema);