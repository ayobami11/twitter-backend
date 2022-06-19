const verifyRequestMethod = (req, res, next) => {
    const allowedMethods = [
        'OPTIONS',
        'HEAD',
        'CONNECT',
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'PATCH'
    ];

    if (!allowedMethods.includes(req.method))
        return res.status(405).json({ message: `${req.method} not allowed.` });

    return next();
};

module.exports = verifyRequestMethod;
