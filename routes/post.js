const express = require("express");
const router = express.Router();
const { validatePost } = require("../middlewares");
const controllers = require("../controllers/post");

router.get("/", controllers.index)

//Render Create Posts Form
router.get("/new", controllers.renderNewPostForm)

//Create Post
router.post("/", validatePost, controllers.createPost)

// Show Post
router.get("/:id", controllers.showPost);

//Render Edit Form
router.get("/:id/edit", controllers.renderEditForm)

// Update Post
router.put("/:id", validatePost, controllers.updatePost);

router.delete("/:id", controllers.destroyPost);

module.exports = router;