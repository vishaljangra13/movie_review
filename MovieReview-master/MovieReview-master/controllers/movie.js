const ReviewModel=require('../models/review');
const UserModel=require('../models/user');
const UserReviewCountModel=require('../models/userReviewCount');
const UserAboutModel = require('../models/user_about');
const http=require('http');

const APIKEY = "e2faa4d0";

exports.searchMovieForReview=(req,res,next)=>{
    let userId=req.params.userId;
    let movieName=req.query.movieName;
    let url = "http://www.omdbapi.com/?apikey="+APIKEY+"&t="+movieName;
    
    let data='',parsedData;
    let isResponse,rating=0;

    http.get(url,resp=>{
        resp.on('data',chunk=>{
            data+=chunk;
        });
        resp.on('end', () => {
            // console.log(data);
            parsedData = JSON.parse(data);
            if(parsedData.Response=='True'){
                isResponse=true;
                let title=parsedData.Title;
                let year = parsedData.Year;
                let ratingArray = parsedData.Ratings;
                let genre=parsedData.Genre;
                let language = parsedData.Language;
                let posterUrl = parsedData.Poster;
                let plot = parsedData.Plot;
                let director=parsedData.Director;
                let writer=parsedData.Writer;
                let imdbId = parsedData.imdbID;
                let movieReviewArray,movieRatingArray,userNameArray,dateArray;

                for (let index = 0; index < ratingArray.length; index++) {
                    const element = ratingArray[index];
                    let result = element.Value.split("/");
                    rating += (Number(result[0]) / Number(result[1]))*5;
                }
                // console.log("imdbid "+imdbId);

                ReviewModel.findOne({imdbId:imdbId}).then(movie=>{
                    if(!movie){
                        let newReview=new ReviewModel({imdbId:imdbId});
                        return newReview.save();
                    }
                    return movie;
                }).then(movie=>{
                    movieReviewArray=movie.movieReviewArray;
                    movieRatingArray=movie.movieRatingArray;
                    userNameArray=movie.userNameArray;
                    dateArray=movie.dateArray;

                    return res.render('movie_page', {
                        isResponse: isResponse,
                        title: title,
                        year: year,
                        genre: genre,
                        language: language,
                        posterUrl: posterUrl,
                        plot: plot,
                        director: director,
                        writer: writer,
                        rating: rating,
                        userId: userId,
                        movieReviewArray:movieReviewArray,
                        movieRatingArray:movieRatingArray,
                        userNameArray:userNameArray,
                        dateArray:dateArray,
                        imdbId:imdbId
                    });
                }).catch(err=>{
                    console.log('ReviewModel Error '+err);
                });
                
                
            }else{
                isResponse=false;
                return res.render('movie_not_found', {
                    userId:userId
                });
            }
        });
    }).on("error", (err) => {
        console.log("searchMovieForReview Error: " + err.message);
    });
};

exports.addReview=(req,res,next)=>{
    const userId=req.params.userId;
    const imdbId = req.params.imdbId;
    const movieReview=req.body.movieReview;
    const movieRating=req.body.movieRating;
    const movieName = req.body.movieName;

    // console.log(req.body);
    const date=new Date();
    
    
    let userName;

    UserAboutModel.findOne({userId:userId}).then(user=>{
        user.noOfReviews+=1;
        return user.save();
    }).then(userAbout=>{
        UserReviewCountModel.findOne({userId:userId}).then(userReviewCount=>{
            if(!userReviewCount){
                userReviewCount=new UserReviewCountModel({userId:userId});
            }
            userReviewCount.reviewArray.push(movieReview);
            userReviewCount.ratingArray.push(movieRating);
            userReviewCount.imdbIdArray.push(imdbId);
            userReviewCount.movieNameArray.push(movieName);
            // console.log("move name "+movieName);
            userReviewCount.save();
        });
    }).catch(err=>{
        console.log('addReview UserReviewCount Error ' + err);
    });

    UserModel.findById(userId).then(user=>{
        userName=user.firstName+' '+user.lastName;
        return userName;
    }).then(userName=>{
        ReviewModel.findOne({imdbId:imdbId}).then(movie=>{
            // console.log("Movie "+movie);
            // console.log("review "+movieReview+" Rating "+movieRating);
            movie.userIdArray.push(userId);
            movie.userNameArray.push(userName);
            movie.movieReviewArray.push(movieReview);
            movie.movieRatingArray.push(movieRating);
            movie.dateArray.push(date);
            return movie.save();
        }).then(movie=>{
            let userNameArray=movie.userNameArray;
            let movieReviewArray=movie.movieReviewArray;
            let movieRatingArray=movie.movieRatingArray;
            let dateArray=movie.dateArray;

            return res.json({
                userNameArray:userNameArray,
                movieReviewArray:movieReviewArray,
                movieRatingArray:movieRatingArray,
                dateArray:dateArray
            });
        }).catch(err => {
            console.log('addReview reviewModel Error ' + err);
        });
    }).catch(err => {
        console.log('addReview Error ' + err);
    });
};