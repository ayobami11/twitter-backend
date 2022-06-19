const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
    {
        tweetId: { type: Schema.Types.ObjectId, required: true },
        userId: { type: Schema.Types.ObjectId, required: true },
        message: { type: String, required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);
