const mongoose = require('mongoose');

const User = require('../../models/user');
const Retweet = require('../../models/retweet');

const getUserRetweets = async (req, res) => {
    try {
        const { userId: currentUserId, handle: currentUserHandle } = req.user;

        const { handle } = req.params;

        let user;

        if (handle !== currentUserHandle) {
            user = await User.findOne({ handle }, '_id').exec();

            if (!user?._id) return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const retweetedTweets = await Retweet.aggregate([
            { $match: { userId: mongoose.Types.ObjectId(handle === currentUserHandle ? currentUserId : user._id) } },
            {
                $lookup: {
                    from: 'tweets',
                    let: { tweetId: '$tweetId' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$tweetId'] } } },
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
                                as: 'likes'
                            }
                        },
                        {
                            $lookup: {
                                from: 'retweets',
                                localField: '_id',
                                foreignField: 'tweetId',
                                as: 'retweets'
                            }
                        },
                        {
                            $lookup: {
                                from: 'comments',
                                localField: '_id',
                                foreignField: 'tweetId',
                                as: 'comments'
                            }
                        }
                    ],
                    as: 'tweet'
                }
            },
            { $unwind: '$tweet' },
            {
                $project: {
                    tweetId: 1,
                    name: '$tweet.user.name',
                    handle: '$tweet.user.handle',
                    avatarUrl: '$tweet.user.avatarUrl',
                    verified: '$tweet.user.verified',
                    message: '$tweet.message',
                    likes: '$tweet.likes.userId',
                    retweets: '$tweet.retweets.userId',
                    comments: '$tweet.comments._id',
                    createdAt: '$tweet.createdAt'
                }
            }
        ]);

        return res.status(200).json({ success: true, retweetedTweets, currentUserId });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, error });
    }
};

module.exports = getUserRetweets;
