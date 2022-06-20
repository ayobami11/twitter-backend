const mongoose = require('mongoose');

const User = require('../../models/user');
const Tweet = require('../../models/tweet');

const getTweets = async (req, res) => {
    try {

        const { userId: currentUserId, handle: currentUserHandle } = req.user;

        const { handle } = req.params;

        let user;

        if (handle !== currentUserHandle) {
            user = await User.findOne({ handle }, '_id').exec();

            if (!user?._id) return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const tweets = await Tweet.aggregate([
            { $match: { userId: mongoose.Types.ObjectId(handle === currentUserHandle ? currentUserId : user._id) } },
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
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'tweetId',
                    as: 'likes_info'
                }
            },
            {
                $lookup: {
                    from: 'retweets',
                    localField: '_id',
                    foreignField: 'tweetId',
                    as: 'retweets_info'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'tweetId',
                    as: 'comments'
                }
            },
            {
                $project: {
                    name: '$user.name',
                    handle: '$user.handle',
                    avatarUrl: '$user.avatarUrl',
                    verified: '$user.verified',
                    message: 1,
                    images: 1,
                    likes: '$likes_info.userId',
                    retweets: '$retweets_info.userId',
                    comments: 1,
                    createdAt: 1
                }
            }
        ]);

        return res.status(200).json({ success: true, tweets, currentUserId });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, error });
    }
};

module.exports = getTweets;
