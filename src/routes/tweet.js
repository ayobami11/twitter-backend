const express = require('express');

const upload = require('../config/multer');

const getTweets = require('../controllers/tweet/getTweets');
const getTweetDetails = require('../controllers/tweet/getTweetDetails');

const createTweet = require('../controllers/tweet/createTweet');

const likeTweet = require('../controllers/tweet/likeTweet');
const unlikeTweet = require('../controllers/tweet/unlikeTweet');

const retweetTweet = require('../controllers/tweet/retweetTweet');
const undoRetweet = require('../controllers/tweet/undoRetweet');

const getComments = require('../controllers/tweet/getComments');
const createComment = require('../controllers/tweet/createComment');

const createTweetWithImage = require('../controllers/tweet/createTweetWithImage');

const router = express.Router();

router.get('/', getTweets);
router.get('/:tweetId', getTweetDetails);
router.post('/create', createTweet, upload.array('image', 4), createTweetWithImage);

router.post('/:tweetId/like', likeTweet);
router.delete('/:tweetId/unlike', unlikeTweet);

router.post('/:tweetId/retweet', retweetTweet);
router.delete('/:tweetId/undo-retweet', undoRetweet);

router.get('/:tweetId/comments', getComments);
router.post('/:tweetId/comment', createComment);

module.exports = router;
