const UserModel=require('../models/user');
const UserAboutModel=require('../models/user_about');
const UserReviewCountModel=require('../models/userReviewCount');
const bcrypt=require('bcrypt');

exports.registerUser = (req, res, next) => {
    const firstName=req.body.first_name;
    const lastName = req.body.last_name;
    const userName = req.body.user_name;
    const password = req.body.user_password;
    const email = req.body.email;
    const contactNo = req.body.contact_no;

    bcrypt.hash(password,12).then(encryptedPassword=>{
        const user=new UserModel({firstName:firstName,lastName:lastName,userName:userName,
            password:encryptedPassword,email:email,contactNo:contactNo});
        return user.save();
    }).then(user=>{
        const aboutUser=new UserAboutModel({userId:user._id});
        aboutUser.save();
        return res.redirect('/home?id='+user._id);
    }).catch(err=>{
        console.log("Error: "+err);
        res.render('registration',{message:'Error occured in registering....Try Again'});
    });
};

exports.loginUser = (req, res, next) => {
    const userName=req.body.user_name;
    const password=req.body.user_password;
    let currentUser;

    UserModel.findOne({userName:userName}).then(user=>{
        if(!user){
            return res.render('login',{message:'Invalid username...Try Again'});
        }
        currentUser=user;
        return bcrypt.compare(password,user.password);
    }).then(isEqual=>{
        if(!isEqual){
            return res.render('login', {
                message: 'Wrong Password...Try Again'
            });
        }
        return res.redirect('/home?id=' + currentUser._id);
    }).catch(err=>{
        console.log("Error: " + err);
        res.render('login', {
            message: 'Error occured in Logging in....Try Again'
        });
    });
};

exports.renderRegisterPage=(req,res,next)=>{
    const userId = req.body.contact_no;
    res.render('registration',{userId:userId});
};

exports.renderLoginPage = (req,res, next) => {
    const userId = req.body.contact_no;
    res.render('login', {
        userId: userId
    });
};

exports.logoutUser=(req,res,next)=>{
    return res.redirect('/home');
};

exports.userProfile = (req, res, next) => {
    let userId=req.params.userId;
    let firstName,lastName,about,hobbies,favouriteMovies,noOfReviews;
    UserModel.findById(userId).then(user=>{
        firstName=user.firstName;
        lastName = user.lastName;   
        return lastName;
    }).then(lastName=>{
        UserAboutModel.findOne({userId:userId}).then(aboutUser=>{
            about=aboutUser.about;
            hobbies=aboutUser.hobbies;
            favouriteMovies=aboutUser.favouriteMovies;
            noOfReviews=aboutUser.noOfReviews
            return res.render('user_profile',{firstName:firstName,lastName:lastName,
                about: about, hobbies: hobbies, favouriteMovies: favouriteMovies, noOfReviews: noOfReviews, userId: userId
                });
        }).catch(err=>{
            console.log(err);
            return res.redirect('/home?id=' + userId);
        });
    }).catch(err=>{
        console.log(err);
        return res.redirect('/home?id=' + userId);
    });
    
};
exports.renderEditProfilePage=(req,res,next)=>{
    let userId=req.params.userId;
    return res.render('edit_user_profile',{userId:userId});
};
exports.editUserProfile=(req,res,next)=>{
    // console.log('in edit profile');
    let userId=req.params.userId;
    let about=req.body.about;
    let hobbies = req.body.hobbies;
    let favouriteMovies = req.body.favouriteMovies;
    UserAboutModel.findOne({userId:userId}).then(aboutUser=>{
        aboutUser.about=about;
        aboutUser.hobbies=hobbies;
        aboutUser.favouriteMovies=favouriteMovies;
        return aboutUser.save();
    }).then(aboutUser=>{
        return res.redirect('/user/profile/'+userId);
    }).catch(err => {
        console.log("Error editUserProfile "+err);
        return res.redirect('/user/edit/profile/'+userId);
    });
};

exports.getUserReviews=(req,res,next)=>{
    let userId=req.params.userId;

    UserReviewCountModel.findOne({userId:userId}).then(userReviewCount=>{
        return res.render('user_review_page',{
            reviewArray:userReviewCount.reviewArray,
            ratingArray:userReviewCount.ratingArray,
            imdbIdArray:userReviewCount.imdbIdArray,
            movieNameArray:userReviewCount.movieNameArray
        });
    })
};