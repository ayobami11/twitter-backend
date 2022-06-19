const User = require('../../models/user');

const getLoggedInUser = async (req, res) => {
    try {

        const { userId } = req.user;

        const user = await User.findById(userId);

        if (!user?._id) return res.status(404).json({ success: false, message: 'User not found.' });

        return res.status(200).json({ success: true, user })
    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, error });
    }

}

module.exports = getLoggedInUser;