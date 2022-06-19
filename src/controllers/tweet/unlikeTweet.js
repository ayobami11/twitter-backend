const Tweet = require('../../models/tweet');
const Like = require('../../models/like');

const unlikeTweet = async (req, res) => {
    try {
        const { tweetId } = req.params;
        const { userId } = req.user;

        // checks if tweet exists
        const tweet = await Tweet.findById(tweetId, '_id').exec();

        if (!tweet?._id)
            return res
                .status(404)
                .json({ success: false, message: 'Tweet not found.' });

        // unlikes tweet if liked
        const like = await Like.findOneAndDelete({ tweetId, userId }).exec();

        if (!like?._id)
            return res.status(404).json({
                success: false,
                message: 'Tweet was not liked.'
            });

        return res
            .status(200)
            .json({ success: true, message: 'Tweet unliked succesfully.' });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, error });
    }
};

module.exports = unlikeTweet;
