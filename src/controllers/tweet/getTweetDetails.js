const mongoose = require('mongoose');

const Tweet = require('../../models/tweet');

const getTweetDetails = async (req, res) => {

    try {
        const { userId: currentUserId } = req.user;
        const { tweetId } = req.params;

        const tweet = await Tweet.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(tweetId) } },
            { $limit: 1 },
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
                    let: { localId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$tweetId', '$$localId'] } } },
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
                    ],
                    as: 'comments'
                },
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
                    comments: 1,
                    createdAt: 1
                }
            }
        ]);

        return res.status(200).json({ success: true, tweet: tweet[0], currentUserId });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, error });
    }
};

module.exports = getTweetDetails;
