const express = require("express");
const app = express();
const ejs = require("ejs");
const PORT = 8080;
const mongoose = require("mongoose");
const path = require("path");
const Post = require("./models/posts");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utility/ExpressError");
const { postSchema } = require("./schema");
const session = require('express-session');
const flash = require("connect-flash");
const { asyncWrapper } = require("./utility/asyncWrapper");

const sessionOption = {
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 30,
    }
}
app.use(session(sessionOption))

app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    console.log(res.locals.successs, res.locals.error)
    next();
});


let validatePost = (req, res, next) => {
    let { error } = postSchema.validate(req.body);
    console.log(req._parsedUrl.pathname)
    if (error) {
        throw new ExpressError(error.details[0].message, 400)
    } else {
        next();
    }
}

// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));

main().then(() => {
    console.log(`DB Connected Successfully`)
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/devConnect');
}

app.get("/", (req, res) => {
    res.redirect("/posts")
})

//Post Routes
//Retrive all the posts here...

app.get("/posts", async (req, res) => {
    let posts = await Post.find();
    res.render("posts/index", { title: "All Posts", posts, currentPage: 'posts' })
})

//Render Create Posts Form
app.get("/posts/new", async (req, res) => {
    res.render("posts/new", { title: "Create Posts" });
})

//Create Post
app.post("/posts", validatePost, asyncWrapper(async (req, res) => {
    let { title, content, code, likes } = req.body.post;

    likes = parseInt(likes) || 0;

    let newPost = new Post({ title, content, code, likes });

    let postRes = await newPost.save();
    if (postRes) {
        req.flash("success", "Successfully Created New Post")
    } else {
        req.flash("error", "Error While Creating Post");
        return res.redirect("/posts")
    }
    res.redirect("/posts");
}))

// Show Post
app.get("/posts/:id", asyncWrapper(async (req, res, next) => {
    let { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
        req.flash("error", "The post you are trying to access doesn't exist")
    }
    res.render("posts/show", { title: post.title, post })
})
)
//Render Edit Form
app.get("/posts/:id/edit", asyncWrapper(async (req, res) => {
    let { id } = req.params;
    let post = await Post.findById(id);
    if (!post) {
        throw new ExpressError("Post Not Found", 400);
    }
    res.render("posts/edit", { title: post.title, post })
}))

// Update Post
app.put("/posts/:id", validatePost, asyncWrapper(async (req, res) => {
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
    }

    res.redirect(`/posts/${id}`);
}));

app.delete("/posts/:id", asyncWrapper(async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/posts");
}));

// // Catch-all for unmatched routes
// app.all("*", (req, res, next) => {
//     next(new ExpressError("Page Not Found", 404));
// });


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Some Error Occurred";
    res.status(statusCode).render("error.ejs", { message });
});

app.listen(PORT, () => {
    console.log(`PORT is runing on ${PORT}`)
})