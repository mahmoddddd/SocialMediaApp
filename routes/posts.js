const router = require('express').Router()
const { default: mongoose } = require('mongoose')
const Post = require('../models/Post')
const User = require('../models/User')


router.post('/post', async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }

});

// Update post
router.put("/edit/:id", async (req, res) => {
    const postId = req.params.id;
    try {
        const existingPost = await Post.findById(postId);

        if (!existingPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        existingPost.desc = req.body.desc || existingPost.desc;
        existingPost.img = req.body.img || existingPost.img;

        await existingPost.save();
        res.status(200).json(existingPost);
        console.log('Post info has been updated');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//delete post
router.delete('/:id', async (req, res) => {
    const postId = req.params.id;
    try {
        const postToDelete = await Post.findById(postId);
        if (!postToDelete) {
            return res.status(404).json('Post not found');
        }

        await Post.findByIdAndDelete(postId);
        res.status(200).json('Post deleted');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.put('/:id/like', async (req, res) => {
    const postId = req.params.id;
    const userId = req.body.userId;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (!post.likes.includes(userId)) {
            await post.updateOne({ $push: { likes: userId } }); // Push userId to likes array
            res.status(200).json('You liked this post');
        } else {
            await post.updateOne({ $pull: { likes: userId } }); // Pull userId from likes array
            res.status(200).json('You disliked this post');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//get a post
router.get('/:id', async (req, res) => {
    postId = req.params.id;
    try {
        const post = await Post.findById(postId)
        if (!post) {
            res.status(404).json('post not found')
        }
        res.status(200).json(post);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})



router.get('/timeline/all', async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);

        const userPosts = await Post.find({ userId: currentUser._id });

        // // Find posts of the user's friends
        // const friendsPosts = await Promise.all(
        //     currentUser.followings.map(async (friendId) => {
        //         return await Post.find({ userId: friendId });
        //     })
        // );

        // //  Concatenate userPosts and friendsPosts arrays
        const allPosts = userPosts//.concat(...friendsPosts);

        // // Send the concatenated posts as response
        res.status(200).json(allPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// // get users id liked post from 
// router.get('/:id/getPeopleLikesId', async (req, res) => {
//     const postId = req.params.id;
//     try {
//         const post = await Post.findById(postId)
//         if (!post) {
//             res.status(404).json('post not found')
//         }
//         const peopledIdLikes = post.likes[1]; // only give me first user in likes array
//         const username = await User.findById(peopledIdLikes)

//         const usernamee = username.name

//         return res.status(200).json(usernamee);

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// })


// get users name liked post from the post id
router.get('/:id/getPeopleLikes', async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json('Post not found');
        }

        const peopleLikedIds = post.likes;
        const peopleLikedNames = [];

        for (const personId of peopleLikedIds) {
            const user = await User.findById(personId);
            if (user) {
                peopleLikedNames.push(user.name);
            }
        }

        res.status(200).json(peopleLikedNames);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




module.exports = router 