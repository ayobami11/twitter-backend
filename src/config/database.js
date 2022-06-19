const mongoose = require('mongoose');

const { MONGODB_CONNECTION_URI } = process.env;

exports.connect = () => {
    mongoose.connect(MONGODB_CONNECTION_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const db = mongoose.connection;

    db.once('open', () => {
        console.log('Connection to database successful.');
    });

    db.on('error', console.error.bind(console, 'MongoDB Connection Error:'));

};
