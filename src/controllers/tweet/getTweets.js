const Tweet = require('../../models/tweet');

const getTweets = async (req, res) => {
    try {

        const { userId: currentUserId } = req.user;

        const tweets = await Tweet.aggregate([
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
                    as: 'comments_info'
                }
            },
            {
                $project: {
                    handle: '$user.handle',
                    avatarUrl: '$user.avatarUrl',
                    name: '$user.name',
                    verified: '$user.verified',
                    message: 1,
                    likes: '$likes_info.userId',
                    retweets: '$retweets_info.userId',
                    comments: '$comments_info._id',
                    createdAt: 1
                }
            },
            {
                $sort: {
                    createdAt: -1
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
