const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

router.post("/register", async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(200).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            res.status(404).json('user not found ')
        }
        const passwordMatch = await bcrypt.compare(req.body.password, user.password)

        if (passwordMatch) {
            res.status(200).json(user)
        } else {
            return res.status(400).json('invalid password ')
        }
    } catch (error) {
        res.status(500).json(error)
    }
});



module.exports = router