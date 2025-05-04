const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
const express = require("express");
const router = express.Router();
const controllers = require("../controllers/user")

router.get("/register", controllers.renderSignUpForm)

router.post("/register", upload.single("user[image]"), controllers.signUpUser);

router.get("/login", controllers.renderLoginForm)

router.post("/login", controllers.loginUser);


router.post("/logout", controllers.logoutUser)

module.exports = router;