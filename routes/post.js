const express = require("express");
const router = express.Router();
const { validatePost, isLoggedIn, isOwner } = require("../middlewares");
const controllers = require("../controllers/post");

router.get("/", controllers.index)

//Render Create Posts Form
router.get("/new", isLoggedIn, controllers.renderNewPostForm)

//Create Post
router.post("/", isLoggedIn, validatePost, controllers.createPost)

// Show Post
router.get("/:id", controllers.showPost);

//Render Edit Form
router.get("/:id/edit", isOwner, isLoggedIn, controllers.renderEditForm)

// Update Post
router.put("/:id", isOwner, isLoggedIn, validatePost, controllers.updatePost);

router.delete("/:id", isOwner, isLoggedIn, controllers.destroyPost);

module.exports = router;