const mongoose = require('mongoose');

const Tweet = require('../../models/tweet');

const Comment = require('../../models/comment');
const Like = require('../../models/like');
const Retweet = require('../../models/retweet');

const deleteTweet = async (req, res) => {
    try {

        const { userId } = req.user;
        const { tweetId } = req.params;

        const tweetToDelete = await Tweet.findById(tweetId).exec();

        if (String(userId) !== String(tweetToDelete?.userId)) {
            return res.status(403).json({ success: false, message: 'You cannot delete this tweet.' });
        }

        await Promise.all([
            Comment.deleteMany({ tweetId: mongoose.Types.ObjectId(tweetId) }).exec(),
            Like.deleteMany({ tweetId: mongoose.Types.ObjectId(tweetId) }).exec(),
            Retweet.deleteMany({ tweetId: mongoose.Types.ObjectId(tweetId) }).exec(),
            Tweet.deleteOne({ _id: mongoose.Types.ObjectId(tweetId) }).exec()
        ]);

        return res
            .status(200)
            .json({ success: true, message: 'Tweet deleted successfully.' });

    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, error });
    }
}

module.exports = deleteTweet;