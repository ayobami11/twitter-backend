const User = require('../../models/user');

const { NODE_ENV } = process.env;

const logout = async (req, res) => {
    try {
        const { userId } = req.user;

        await User.findByIdAndUpdate(userId, { accessToken: '', refreshToken: '' });

        res.clearCookie('accessToken', { secure: NODE_ENV !== 'development' });
        res.clearCookie('refreshToken', { secure: NODE_ENV !== 'development' });

        return res.status(200).json({ success: true, message: 'Logout successful.' });
    } catch (error) {
        console.log(error);
    }

}

module.exports = logout;