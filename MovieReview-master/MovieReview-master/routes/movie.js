const express=require('express');

const router=express.Router();

const movieControllers = require('../controllers/movie');

router.get('/search',movieControllers.searchMovieForReview);
router.get('/search/:userId', movieControllers.searchMovieForReview);
router.post('/add/review/:userId/:imdbId',movieControllers.addReview);

module.exports=router;