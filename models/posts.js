const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0,
        required: true
    },
}, { timestamps: true });

const Post = model("Post", postSchema);
module.exports = Post;