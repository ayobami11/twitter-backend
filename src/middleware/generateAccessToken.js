const jwt = require('jsonwebtoken');

const User = require('../models/user');

const generateAccessToken = async (req, res, next) => {
    try {
        console.log(req.cookies.accessToken);
        console.log(req.cookies.refreshToken);

        if (req.cookies.accessToken) return next();

        const { refreshToken } = req.cookies;

        const { REFRESH_TOKEN_SECRET, NODE_ENV } = process.env;

        if (!refreshToken) return res.status(401).json({ success: false, message: 'No refresh token provided.' });

        const decodedRefreshToken = await jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedRefreshToken.userId).exec();

        if (!user._id) return res.status(401).json({ success: false, message: 'User not found.' });

        console.log(user);

        await user.generateAccessToken();

        // for the initial request since the accessToken cookie will still be undefinded till the next request
        res.locals.accessToken = user.accessToken;

        res.cookie('accessToken', user.accessToken, {
            secure: NODE_ENV !== 'development',
            httpOnly: true,
            // expires in 15 minutes
            maxAge: 1000 * 60 * 15
        });

        return next();

    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, error })
    }
}

module.exports = generateAccessToken;