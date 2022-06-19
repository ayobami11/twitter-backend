const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RetweetSchema = new Schema({
    tweetId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('Retweet', RetweetSchema);
