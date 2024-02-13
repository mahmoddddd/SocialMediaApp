const User = require('../models/User');
const bcrypt = require('bcrypt')
const router = require('express').Router()




// update user 
router.put("/update/:id", async (req, res) => {

    const userId = req.params.id;
    try {
        const existingUser = await User.findById(userId)

        if (!existingUser) {
            return res.status(404).json({ message: 'User Not found' });
        }

        existingUser.name = req.body.name || existingUser.name;
        existingUser.email = req.body.email || existingUser.email;

        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 12)
            existingUser.password = hashedPassword;
        }


        await existingUser.save();
        res.status(200).json(existingUser);
        console.log('user info has been updated')



    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// delete user 
router.delete('/delete/:id', async (req, res) => {
    const userId = req.params.id
    try {
        const existingUser = await User.findById(userId)

        if (!existingUser) {
            return res.status(404).json({ message: 'User Not found' });
        }

        const user = await User.findByIdAndDelete(userId)
        res.status(200).json('user has been deleted')
    }

    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// get a user by id
router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId)

        if (user) {
            const { password, updatedAt, ...others } = user.toObject() // to unsend password and updatedAt 
            res.status(200).json(others)
        }
        else {
            res.status(404).json('user not found')
        }


    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// follow a user

router.put("/:id/follow", async (req, res) => {
    const userId = req.params.id;
    const followedUserId = req.body.userId;

    try {
        if (userId === followedUserId) {
            return res.status(403).json('You cannot follow yourself');
        }

        const user = await User.findById(userId);
        const followedUser = await User.findById(followedUserId);

        if (!user || !followedUser) {
            return res.status(404).json('User not found');
        }

        if (user.followers.includes(followedUserId)) {
            return res.status(403).json('You already follow this account');
        }

        await user.updateOne({ $push: { followers: followedUserId } });
        await followedUser.updateOne({ $push: { followings: userId } });

        res.status(200).json('User has been followed');
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error');
    }
});


// unfollow a user

router.put("/:id/unfollow", async (req, res) => {
    const userId = req.params.id;
    const followedUserId = req.body.userId;

    try {
        if (userId === followedUserId) {
            return res.status(403).json('You cannot unfollow yourself');
        }

        const user = await User.findById(userId);
        const followedUser = await User.findById(followedUserId);

        if (!user || !followedUser) {
            return res.status(404).json('User not found');
        }

        if (!user.followers.includes(followedUserId)) {
            return res.status(403).json('You Dont follow this account');
        }

        await user.updateOne({ $pull: { followers: followedUserId } });
        await followedUser.updateOne({ $pull: { followings: userId } });

        res.status(200).json('User has been unfollowed');
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error');
    }
});



module.exports = router