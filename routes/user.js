const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
const express = require("express");
const User = require("../models/users");
const router = express.Router();


router.get("/register", (req, res) => {
    res.render("users/register.ejs", { title: "Sign Up Form" })
})

router.post("/register", upload.single("user[image]"), async (req, res) => {
    let { user } = req.body;
    user.image = {
        filename: req.file.filename,
        url: req.file.path
    }
    let newUser = new User({ ...user });  // password will be auto-hashed
    let savedUser = await newUser.save();

    console.log(savedUser)
    req.flash("success", "Welcome to DevConnect!");
    res.redirect("/posts");
});

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
})

router.post("/login", async (req, res) => {
    let { username, password } = req.body.user;
    let user = await User.findOne({ username });

    if (!user) {
        req.flash("error", "Invalid username or password.");
        return res.redirect("/login");
    }

    let isValid = await user.validatePassword(password);

    if (isValid) {
        req.flash("success", `Welcome back, ${username}!`);
        res.redirect("/posts");
    } else {
        req.flash("error", "Invalid username or password.");
        res.redirect("/login");
    }
});



module.exports = router;