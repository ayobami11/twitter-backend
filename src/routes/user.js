const express = require('express');

const upload = require('../config/multer');

// const getLoggedInUser = require('../controllers/user/getLoggedInUser');
const getUserProfile = require('../controllers/user/getUserProfile');

const getFollowers = require('../controllers/user/getFollowers');
const getFollowing = require('../controllers/user/getFollowing');

const followUser = require('../controllers/user/followUser');
const unfollowUser = require('../controllers/user/unfollowUser');

const updateProfile = require('../controllers/user/updateProfile');
const updateProfileWithAvatar = require('../controllers/user/updateProfileWithAvatar');

const getUserTweets = require('../controllers/user/getUserTweets');
const getUserLikes = require('../controllers/user/getUserLikes');
const getUserRetweets = require('../controllers/user/getUserRetweets');

const logoutUser = require('../controllers/user/logoutUser');

const router = express.Router();


router.get('/', getUserProfile);
router.get('/:handle', getUserProfile);

router.get('/:handle/followers', getFollowers);
router.get('/:handle/following', getFollowing);

router.post('/:handle/follow', followUser);
router.post('/:handle/unfollow', unfollowUser);

router.get('/:handle/tweets', getUserTweets);
router.get('/:handle/likes', getUserLikes);
router.get('/:handle/retweets', getUserRetweets);

router.put('/edit-profile', updateProfile, upload.single('profile_picture'), updateProfileWithAvatar);

router.post('/logout', logoutUser);


module.exports = router;
