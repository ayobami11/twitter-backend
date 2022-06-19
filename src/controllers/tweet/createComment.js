const mongoose = require('mongoose');

const Tweet = require('../../models/tweet');
const Comment = require('../../models/comment');

const createComment = async (req, res) => {
    try {
        const { tweetId } = req.params;
        const { userId } = req.user;
        const { message } = req.body;

        // check if tweet exists
        const tweet = await Tweet.findById(tweetId, '_id').exec();

        if (!tweet?._id)
            return res
                .status(404)
                .json({ success: false, message: 'Tweet not found.' });

        // creates a new comment
        const newComment = await Comment.create({ tweetId, userId, message });

        if (!newComment?._id) return res.status(400).json({ success: false, message: 'Comment could not be created.' });

        const comment = await Comment.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(newComment._id) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    message: 1,
                    name: '$user.name',
                    handle: '$user.handle',
                    avatarUrl: '$user.avatarUrl',
                    createdAt: 1
                }
            }
        ]);

        return res.status(201).json({ success: true, comment: comment[0], message: 'Comment created successfully.' });

    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, error });
    }
};

module.exports = createComment;
