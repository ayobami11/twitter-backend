const Tweet = require('../../models/tweet');
const Retweet = require('../../models/retweet');

const undoRetweet = async (req, res) => {
    try {
        const { tweetId } = req.params;
        const { userId } = req.user;

        // checks if tweet exists
        const tweet = await Tweet.findById(tweetId, '_id').exec();

        if (!tweet?._id)
            return res
                .status(404)
                .json({ success: false, message: 'Tweet not found.' });

        // undoes retweet if retweeted
        const retweet = await Retweet.findOneAndDelete({
            tweetId,
            userId
        }).exec();

        if (!retweet?._id)
            return res.status(403).json({
                success: false,
                message: 'Tweet was not retweeted.'
            });

        return res
            .status(200)
            .json({
                success: true,
                message: 'Tweet retweet undone succesfully.'
            });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, error });
    }
};

module.exports = undoRetweet;
