const Tweet = require('../../models/tweet');
const Retweet = require('../../models/retweet');

const retweetTweet = async (req, res) => {
    try {
        const { tweetId } = req.params;
        const { userId } = req.user;

        // checks if tweet exists
        const tweet = await Tweet.findById(tweetId, '_id').exec();

        if (!tweet?._id)
            return res
                .status(404)
                .json({ success: false, message: 'Tweet not found.' });

        // checks if tweet has been retweeted
        const retweet = await Retweet.findOne({ tweetId, userId }, '_id').exec();

        if (retweet?._id)
            return res
                .status(403)
                .json({ success: false, message: 'Tweet already retweeted.' });

        // tweet is retweeted if it has not been retweeted
        const newRetweet = await Retweet.create({ tweetId, userId });

        if (!newRetweet?._id)
            return res.status(400).json({
                success: false,
                message: 'Tweet could not be retweeted.'
            });

        return res
            .status(201)
            .json({ success: true, message: 'Tweet retweeted successfully.' });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, error });
    }
};

module.exports = retweetTweet;
