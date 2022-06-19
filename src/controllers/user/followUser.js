const User = require('../../models/user');
const Follower = require('../../models/follower');

const followUser = async (req, res) => {
    try {
        const { userId: followerId, handle: followerHandle } = req.user;

        const { handle } = req.params;

        // checks if the user being followed exists
        const followingUser = await User.findOne({ handle }, '_id');

        if (!followingUser?._id) return res.status(404).json({ success: false, message: 'User not found.' })

        // prevents the user from following their own account
        if (followingUser._id === followerId) return res.status(403).json({ success: false, message: 'You cannot follow your own account.' });

        // checks if the user is already following the target account
        const follower = await Follower.findOne({ followerId, followingId: followingUser._id }, '_id');

        if (follower?._id) return res.status(403).json({ success: false, message: 'You are already following this account.' });

        await Follower.create({ followerId, followingId: followingUser._id });

        return res.status(200).json({ success: true, message: `${followerHandle} is now following ${handle}.`, followerId })

    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, error });
    }
}

module.exports = followUser;