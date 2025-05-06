const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Post = require("../models/posts");
const { isLoggedIn } = require("../middlewares");

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

    // Find the user you want to follow/unfollow
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

    console.log("Current User Updated: ", currUser);
    console.log("User Followed Updated: ", userToFollow);

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
})


module.exports = router;
