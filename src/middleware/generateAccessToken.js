const jwt = require('jsonwebtoken');

const User = require('../models/user');

const generateAccessToken = async (req, res, next) => {
    try {

        const { authorization } = req.headers;

        const accessTokenCookie = req.cookies?.accessToken || req.cookies?.['accessToken-legacy'];
        const refreshTokenCookie = req.cookies?.refreshToken || req.cookies?.['refreshToken-legacy'];

        if (accessTokenCookie || authorization?.split(' ')[1]) return next();

        const { REFRESH_TOKEN_SECRET, NODE_ENV } = process.env;

        if (!refreshTokenCookie) return res.status(401).json({ success: false, message: 'No refresh token provided.' });

        const decodedRefreshToken = await jwt.verify(refreshTokenCookie, REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedRefreshToken.userId).exec();

        if (!user?._id) return res.status(404).json({ success: false, message: 'User not found.' });

        await user.generateAccessToken();

        // for the initial request since the accessToken cookie will still be undefinded till the next request
        res.locals.accessToken = user.accessToken;

        res.cookie('accessToken', user.accessToken, {
            secure: NODE_ENV !== 'development',
            httpOnly: true,
            sameSite: 'none',
            // expires in 15 minutes
            maxAge: 1000 * 60 * 15
        });

        // to provide support for incompatible browsers without samesite=none
        res.cookie('accessToken-legacy', user.accessToken, {
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