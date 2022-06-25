const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    try {
        const { ACCESS_TOKEN_SECRET } = process.env;

        const { authorization } = req.headers;

        const accessTokenCookie = req.cookies?.accessToken || req.cookies?.['accessToken-legacy'];

        const accessToken = authorization?.split(' ')[1] || accessTokenCookie || res.locals.accessToken;

        if (!accessToken) return res.status(401).json({ success: false, message: 'Token not provided.' });

        jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).json({ success: false, message: 'Invalid token.' });

            req.user = user;

            return next();
        });
    } catch (error) {
        console.log(error);

        return res.status(401).json({ error, message: 'User session expired. Please login again.' })
    }
};

module.exports = authenticateToken;
