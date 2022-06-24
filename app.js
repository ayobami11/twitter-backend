const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('dotenv').config();
require('./src/config/database').connect();

const verifyRequestMethod = require('./src/middleware/verifyRequestMethod');
const generateAccessToken = require('./src/middleware/generateAccessToken');
const authenticateToken = require('./src/middleware/authenticateToken');

const tweetsRouter = require('./src/routes/tweet');
const authRouter = require('./src/routes/auth');
const userRouter = require('./src/routes/user');

const getUsers = require('./src/controllers/user/getUsers');

const app = express();

const port = process.env.PORT || 5000;

app.use(cors({ origin: ['http://localhost:3000', 'https://tweetteer.netlify.app'], credentials: true }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

app.use(verifyRequestMethod);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tweets', [generateAccessToken, authenticateToken], tweetsRouter);
app.use('/api/v1/user', [generateAccessToken, authenticateToken], userRouter);

app.get('/api/v1/users', [generateAccessToken, authenticateToken], getUsers);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
});
