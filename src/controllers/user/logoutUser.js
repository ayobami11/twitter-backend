const User = require('../../models/user');

const logout = async (req, res) => {
    try {
        const { userId } = req.user;

        await User.findByIdAndUpdate(userId, { accessToken: '', refreshToken: '' });

        res.clearCookie('accessToken', { secure: NODE_ENV !== 'development', sameSite: 'None', httpOnly: true });
        res.clearCookie('refreshToken', { secure: NODE_ENV !== 'development', sameSite: 'None', httpOnly: true });

        return res.status(200).json({ success: true, message: 'Logout successful.' });
    } catch (error) {
        console.log(error);
    }

}

module.exports = logout;