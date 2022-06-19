const mongoose = require('mongoose');

const User = require('../../models/user');
const Follower = require('../../models/follower');

const getFollowing = async (req, res) => {
    try {
        const { handle } = req.params;

        const { userId: currentUserId, handle: currentUserHandle } = req.user;

        let user;

        if (handle !== currentUserHandle) {
            user = await User.findOne({ handle }, '_id');

            if (!user?._id) return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const following = await Follower.aggregate([
            { $match: { followerId: mongoose.Types.ObjectId(handle === currentUserHandle ? currentUserId : user._id) } },
            {
                $lookup: {
                    from: 'users',
                    let: { followingId: '$followingId' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$followingId'] } } },
                        {
                            $lookup: {
                                from: 'followers',
                                localField: '_id',
                                foreignField: 'followingId',
                                as: 'followers_info'
                            }
                        }, {
                            $project: {
                                _id: 0,
                                name: 1,
                                handle: 1,
                                avatarUrl: 1,
                                verified: 1,
                                bio: 1,
                                followers: '$followers_info.followerId'
                            }
                        }
                    ],
                    as: 'follower'
                }
            },
            { $unwind: '$follower' },
            {
                $project: {
                    _id: 0,
                    name: '$follower.name',
                    handle: '$follower.handle',
                    avatarUrl: '$follower.avatarUrl',
                    verified: '$follower.verified',
                    bio: '$follower.bio',
                    followers: '$follower.followers'
                }
            }
        ]);

        return res.status(200).json({ success: true, following, currentUserId })
    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, error });
    }
}

module.exports = getFollowing;