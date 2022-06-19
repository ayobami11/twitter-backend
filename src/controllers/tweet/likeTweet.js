const Tweet = require('../../models/tweet');
const Like = require('../../models/like');

const likeTweet = async (req, res) => {
    try {
        const { tweetId } = req.params;
        const { userId } = req.user;

        // check if tweet exists
        const tweet = await Tweet.findById(tweetId, '_id').exec();

        if (!tweet?._id)
            return res
                .status(404)
                .json({ success: false, message: 'Tweet not found.' });

        // checks if tweet has been liked
        const like = await Like.findOne({ tweetId, userId }, '_id').exec();

        if (like?._id)
            return res
                .status(403)
                .json({ success: false, message: 'Tweet already liked.' });

        // tweet is liked if it has not been liked
        const newLike = await Like.create({ tweetId, userId });

        if (!newLike?._id)
            return res.status(400).json({
                success: false,
                message: 'Tweet could not be liked.'
            });

        return res
            .status(201)
            .json({ success: true, message: 'Tweet liked succesfully.' });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, error });
    }
};

module.exports = likeTweet;
