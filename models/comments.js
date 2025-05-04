const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const commentSchema = new Schema({
    comment: {
        type: String,
        required: true,
    }
});

const Comment = model("Comment", commentSchema);
module.exports = Comment;