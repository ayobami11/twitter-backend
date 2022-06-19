const express = require('express');

const login = require('../controllers/auth/login');
const signup = require('../controllers/auth/signup');

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);

module.exports = router;