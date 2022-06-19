const User = require('../../models/user');

const updateProfileWithAvatar = async (req, res) => {
    try {
        const { userId } = req.user;
        const { name, bio } = req.body;

        const user = await User.findByIdAndUpdate(userId, { name, bio, avatarUrl: req.file.path }, { new: true });

        return res.status(200).json({ success: true, message: 'Profile updated successfully.', user });

    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, error });
    }
}

module.exports = updateProfileWithAvatar;