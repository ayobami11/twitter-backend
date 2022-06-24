const User = require('../../models/user');

const getUserProfile = async (req, res) => {
    try {
        const { userId: currentUserId, handle: currentUserHandle } = req.user;
        const { handle } = req.params;

        const user = await User.aggregate([
            { $match: { handle: handle || currentUserHandle } },
            {
                $lookup: {
                    from: 'followers',
                    localField: '_id',
                    foreignField: 'followingId',
                    as: 'followers_info'
                }
            },
            {
                $lookup: {
                    from: 'followers',
                    localField: '_id',
                    foreignField: 'followerId',
                    as: 'following_info'
                }

            }, {
                $project: {
                    name: 1,
                    handle: 1,
                    bio: 1,
                    avatarUrl: 1,
                    verified: 1,
                    createdAt: 1,
                    followers: '$followers_info.followerId',
                    following: '$following_info.followingId'
                }
            }
        ]);

        if (!user?.length) return res.status(404).json({ success: false, message: 'User not found.' });

        return res.status(200).json({
            success: true, user: user[0], currentUserId, currentUserHandle
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, error })
    }

}

module.exports = getUserProfile;