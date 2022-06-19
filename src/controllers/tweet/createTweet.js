const Tweet = require('../../models/tweet');

const createTweet = async (req, res, next) => {
    try {
        const { message } = req.body;
        const { image } = req.query;
        const { userId } = req.user;

        if (image) {
            return next();
        } else {
            const tweet = await Tweet.create({ userId, message });

            return res
                .status(201)
                .json({
                    success: true,
                    tweet,
                    message: 'Tweet created successfully.'
                });
        }

    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, error });
    }
};

module.exports = createTweet;
