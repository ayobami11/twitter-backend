const bcrypt = require('bcryptjs');

const User = require('../../models/user');

const { NODE_ENV } = process.env;

const comparePassword = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.log(error);
    }

    return false;
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).exec();

        if (!user?._id)
            return res
                .status(404)
                .json({ success: false, message: 'User does not exist.' });

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) return res.status(401).json({ success: false, message: 'Invalid user credentials.' });

        await user.generateAccessToken();
        await user.generateRefreshToken();


        res.cookie('accessToken', user.accessToken, {
            secure: NODE_ENV !== 'development',
            httpOnly: true,
            // expires in 15 minutes
            maxAge: 1000 * 60 * 15
        });

        res.cookie('refreshToken', user.refreshToken, {
            secure: NODE_ENV !== 'development',
            httpOnly: true,
            // expires in 7 days
            maxAge: 1000 * 60 * 60 * 24 * 7
        });


        return res.status(200).json({ success: true, user, message: 'Login successful.' });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, error });
    }
};

module.exports = login;
