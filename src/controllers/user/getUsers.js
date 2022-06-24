const mongoose = require('mongoose');

const User = require('../../models/user');

const getUsers = async (req, res) => {
    try {

        const { userId } = req.user;

        const users = await User.aggregate([
            { $match: { _id: { $ne: mongoose.Types.ObjectId(userId) } } },
            {
                $lookup: {
                    from: 'followers',
                    localField: '_id',
                    foreignField: 'followingId',
                    as: 'followers_info'
                }
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    handle: 1,
                    avatarUrl: 1,
                    bio: 1,
                    verified: 1,
                    followers: '$followers_info.followerId',
                }
            }
        ]);

        return res.status(200).json({ success: true, users, currentUserId: userId })

    } catch (error) {
        console.log(error);
    }
}

module.exports = getUsers;