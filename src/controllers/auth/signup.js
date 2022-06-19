const bcrypt = require('bcryptjs');

const User = require('../../models/user');

const hashPassword = async (password, saltRounds) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);

        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.log(error);

        return null;
    }
};

const signup = async (req, res) => {
    try {
        const { name, email, password, handle } = req.body;

        const encryptedPassword = await hashPassword(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: encryptedPassword,
            handle
        });


        if (!newUser?._id) return res.status(400).json({ success: false, err });

        return res.status(201).json({ success: true, message: 'Signup successful.' });
    } catch (error) {
        console.log(error);

        // checks if the email or handle has been taken
        if (error.code === 11000) {
            const [key, value] = Object.entries(error.keyValue)[0];
            return res.status(422).json({ success: false, message: `${key} [${value}] has been taken.` })
        }

        return res.status(500).json({ success: false, error });
    }
};

module.exports = signup;
