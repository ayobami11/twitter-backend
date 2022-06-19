const mongoose = require('mongoose');

const Comment = require('../../models/comment');

const getComments = async (req, res) => {
    try {
        const { tweetId } = req.params;

        const comments = await Comment.aggregate([
            { $match: { tweetId: mongoose.Types.ObjectId(tweetId) } },
            { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' }
        ]).exec();

        return res.status(200).json({ success: true, comments });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, error });
    }
};

module.exports = getComments;
