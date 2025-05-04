const Post = require("../models/posts");
const { asyncWrapper } = require("../utility/asyncWrapper")
const ExpressError = require("../utility/ExpressError");

module.exports.index = async (req, res) => {
    let posts = await Post.find();
    res.render("posts/index", { title: "All Posts", posts })
}

module.exports.renderNewPostForm = async (req, res) => {
    res.render("posts/new", { title: "Create Posts" });
}

module.exports.createPost = asyncWrapper(async (req, res) => {
    let { title, content, code, likes } = req.body.post;

    likes = parseInt(likes) || 0;

    let newPost = new Post({ title, content, code, likes });

    let postRes = await newPost.save();
    if (postRes) {
        req.flash("success", "Successfully Created New Post")
    } else {
        req.flash("error", "Error While Creating Post");
        return res.redirect("/posts/new")
    }
    res.redirect("/posts");
});

module.exports.showPost = asyncWrapper(async (req, res, next) => {
    let { id } = req.params;
    const post = await Post.findById(id).populate("comments");
    if (!post) {
        req.flash("error", "The post you are trying to access doesn't exist");
        return res.redirect("/posts")
    }
    res.render("posts/show", { title: post.title, post })
})

module.exports.renderEditForm = asyncWrapper(async (req, res) => {
    let { id } = req.params;
    let post = await Post.findById(id);
    if (!post) {
        req.flash("error", "The Post You are trying to edit doesn't exist");
        return res.redirect("/posts")
    }
    res.render("posts/edit", { title: post.title, post })
})

module.exports.updatePost = asyncWrapper(async (req, res) => {
    let { id } = req.params;
    let { post } = req.body;

    if (!post) {
        throw new ExpressError("No Post Data Sent", 400);
    }

    let updatedPost = await Post.findByIdAndUpdate(id, {
        $set: {
            title: post.title,
            content: post.content,
            code: post.code,
            likes: post.likes
        }
    }, { new: true, });

    if (!updatedPost) {
        throw new ExpressError("Post Not Found", 404);
    } else {
        req.flash("success", "Post Updated Successfully");
    }

    res.redirect(`/posts/${id}`);
});

module.exports.destroyPost = asyncWrapper(async (req, res) => {
    let dltPost = await Post.findByIdAndDelete(req.params.id);
    if (!dltPost) {
        req.flash("error", "The Post You are trying to Delete Doesn't Exist");
    } else {
        req.flash("success", "Post Deleted Successfully")
    }
    res.redirect("/posts");
})