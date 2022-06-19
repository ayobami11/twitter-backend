const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TweetSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, required: true },
        message: {type: String, default: ''},
        images: [String]
    },
    { timestamps: true }
);


module.exports = mongoose.model('Tweet', TweetSchema);
