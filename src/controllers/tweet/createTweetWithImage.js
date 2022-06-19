const Tweet = require('../../models/tweet');

const createTweetWithImage = async (req, res) => {
    try {
        const { userId } = req.user;
        const { message } = req.body;

        const tweet = await Tweet.create({ userId, message, images: req.files.map(file => file.path) });

        return res.status(201).json({ success: true, message: 'Tweet created successfully.', tweet });

    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, error });
    }
}

module.exports = createTweetWithImage;