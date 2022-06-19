const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: 20 },
        email: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true, minlength: 8 },
        handle: { type: String, required: true, unique: true, trim: true, maxlength: 20 },
        avatarUrl: { type: String, default: '' },
        bio: { type: String, default: '' },
        verified: { type: Boolean, default: false },
        accessToken: { type: String, default: '' },
        refreshToken: { type: String, default: '' }
    },
    { timestamps: true }
);

UserSchema.methods.generateAccessToken = function () {
    const User = this;

    const accessToken = jwt.sign({ userId: User._id, handle: User.handle }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    User.accessToken = accessToken;
}

UserSchema.methods.generateRefreshToken = function () {
    const User = this;

    const refreshToken = jwt.sign({ userId: User._id, handle: User.handle }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    User.refreshToken = refreshToken;
}

module.exports = mongoose.model('User', UserSchema);
