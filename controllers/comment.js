const Comment = require("../models/comments");
const Post = require("../models/posts");
const { asyncWrapper } = require("../utility/asyncWrapper");

module.exports.createComment = asyncWrapper(async (req, res) => {
    let { id } = req.params;
    let { comment } = req.body;

    let newComment = new Comment({ ...comment });
    let svdComment = await newComment.save();

    if (svdComment) {
        // Push comment reference into Post's comments array
        let updatedPost = await Post.findByIdAndUpdate(id, { $push: { comments: svdComment._id } });

        req.flash("success", "Comment Created Successfully");
    } else {
        req.flash("error", "Error while Creating Comment");
    }

    res.redirect(`/posts/${id}`);
});

module.exports.destroyComment = asyncWrapper(async (req, res) => {
    let { id, commentId } = req.params;
    // 1. Delete the comment
    let comment = await Comment.findByIdAndDelete(commentId);
    console.log(comment)
    // 2. Pull the comment reference from post
    const post = await Post.findByIdAndUpdate(id, {
        $pull: { comments: commentId }
    });
    console.log(post)
    req.flash("success", "Comment Deleted Successfully!");
    res.redirect(`/posts/${id}`);
})