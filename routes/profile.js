const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Post = require("../models/posts");
const { isLoggedIn } = require("../middlewares");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

//Get Profile
router.get("/profile/:username", isLoggedIn, async (req, res) => {
    let { username } = req.params;

    // Get single user (findOne returns object not array)
    let user = await User.findOne({ username: username });

    // Get all posts with owner populated
    let posts = await Post.find().populate("owner");

    // Filter posts that belong to this user
    let userPosts = posts.filter((post) => {
        return post.owner._id.equals(user._id);
    });

    console.log(user);
    console.log(userPosts);

    res.render("profile/profile.ejs", { title: username, userProfile: user, posts: userPosts });
});

// Add or Remove Follower (Toggle)
router.patch("/profile/:id", async (req, res) => {
    let { id } = req.params;

    let userToFollow = await User.findById(id);

    // Get current logged-in user from session
    let sessionUser = res.locals.currUser;
    let currUser = await User.findOne({ username: sessionUser.username });

    // Check if already following
    let isFollowing = userToFollow.followers.includes(currUser._id);

    if (isFollowing) {
        // Unfollow: Remove currUser from userToFollow's followers
        userToFollow.followers = userToFollow.followers.filter(
            (followerId) => !followerId.equals(currUser._id)
        );
        await userToFollow.save();

        // Remove userToFollow from currUser's following
        currUser.following = currUser.following.filter(
            (followingId) => !followingId.equals(userToFollow._id)
        );
        await currUser.save();
    } else {
        // Follow: Add currUser to userToFollow's followers
        userToFollow.followers.push(currUser._id);
        await userToFollow.save();

        // Add userToFollow to currUser's following
        currUser.following.push(userToFollow._id);
        await currUser.save();
    }

    res.redirect(`/profile/${userToFollow.username}`);
});

//Get Followings
router.get("/profile/:username/following", async (req, res) =>{
    let {username} = req.params;
    let user = await User.findOne({username: username}).populate("following");
    let followings = user.following;
    res.render("profile/following.ejs" , {followings})
});

//Get Followers
router.get("/profile/:username/follower",async (req, res) =>{
    let {username} = req.params;
    let user = await User.findOne({username: username}).populate("followers");
    let followers = user.followers;
    res.render("profile/followers.ejs" , {followers})
});

router.get("/profile/:username/edit", async (req, res) => {
    let {username} = req.params;
    let user = await User.findOne({username: username})
    res.render("profile/editProfile.ejs" , {user});
})

router.put("/profile/:userId", upload.single("user[image]"), async (req, res) => {
        let { userId } = req.params;
        let { user } = req.body;

        let userToUpdate = await User.findByIdAndUpdate(userId, { ...user }, { new: true });

        if (req.file && req.file.path && req.file.filename) {
            userToUpdate.image = {
                filename: req.file.filename,
                url: req.file.path
            };
            await userToUpdate.save();
        }

        return res.redirect(`/profile/${userToUpdate.username}`);
});


router.post("/posts/:postId/like", async (req, res) => {
    try {
        let { postId } = req.params;
        let userId = res.locals.currUser._id; // assuming user is logged in and available in req.user

        let post = await Post.findById(postId);

        // Check if user has already liked
        let likedIndex = post.likes.indexOf(userId);

        if (likedIndex === -1) {
            // Not liked yet ➔ Add like
            post.likes.push(userId);
        } else {
            // Already liked ➔ Unlike
            post.likes.splice(likedIndex, 1);
        }

        await post.save();

        return res.redirect("/posts"); // redirects back to the same page
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});


module.exports = router;
