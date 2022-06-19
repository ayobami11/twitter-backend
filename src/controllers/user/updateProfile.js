const User = require('../../models/user');

const updateProfile = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { avatar } = req.query;
        const { name, bio } = req.body;

        if (avatar) {
            return next();
        } else {
            const user = await User.findByIdAndUpdate(userId, { name, bio }, { new: true });

            return res.status(200).json({ success: true, message: 'Profile updated successfully.', user })
        }

    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, error });
    }
}

module.exports = updateProfile;