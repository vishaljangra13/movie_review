const express = require('express');

const router = express.Router();

const userControllers=require('../controllers/user');

router.get('/register', userControllers.renderRegisterPage);
router.post('/register',userControllers.registerUser);

router.post('/login', userControllers.loginUser);
router.get('/login', userControllers.renderLoginPage);

router.get('/logout', userControllers.logoutUser);

router.get('/profile/:userId',userControllers.userProfile);
router.get('/edit/profile/:userId', userControllers.renderEditProfilePage);
router.post('/edit/profile/:userId', userControllers.editUserProfile);

router.get('/reviews/:userId', userControllers.getUserReviews);

module.exports = router;