const mongoose = require("mongoose");
const data = require("./data");
const Post = require("../models/posts");

main().then(() => {
    console.log(`DB Connected Successfully`)
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/devConnect');
};


const initDb = async () => {
    let allPost = await Post.deleteMany();
    const allPosts = await Post.insertMany(data);
    console.log(`Data intialized`);
    console.log(allPosts)
}

initDb()