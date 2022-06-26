const User = require('../../models/user');
const Follower = require('../../models/follower');

const unfollowUser = async (req, res) => {
    try {
        const { userId: followerId, handle: followerHandle } = req.user;
        const { handle } = req.params;

        // checks if the user being unfollowed exists
        const followingUser = await User.findOne({ handle }, '_id');

        if (!followingUser?._id) return res.status(404).json({ success: false, message: 'User not found.' })

        // prevents the user from unfollowing their own account
        if (String(followingUser._id) === String(followerId)) return res.status(403).json({ success: false, message: 'You cannot unfollow your own account.' });

        // unfollows the target account if followed previously
        const follower = await Follower.findOneAndDelete({
            followerId, followingId: followingUser._id
        }).exec();

        if (!follower?._id) return res.status(403).json({ success: false, message: 'You were not following this account.' });

        return res.status(200).json({ success: true, message: `${followerHandle} is no longer following ${handle}.`, oldFollowerId: followerId })

    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, error });
    }
}

module.exports = unfollowUser;