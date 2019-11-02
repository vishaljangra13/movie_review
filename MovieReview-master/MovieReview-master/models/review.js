const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const reviewSchema=new Schema({
    userIdArray:{
        type:Array,
        of: String
    },
    userNameArray:{
        type:Array,
        of: String
    },
    movieReviewArray:{
        type: Array,
        of: String
    },
    imdbId:{
        type: String,
        required: true
    },
    movieRatingArray:{
        type: Array,
        of: Number
    },
    dateArray:{
        type:Array,
        of: Date
    }
});

module.exports=mongoose.model('ReviewModel',reviewSchema);