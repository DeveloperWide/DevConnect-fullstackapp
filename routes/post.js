const express = require("express");
const router = express.Router();
const { validatePost, isLoggedIn, isOwner, userCurrentPath } = require("../middlewares");
const controllers = require("../controllers/post");

router.route("/").get(isLoggedIn, controllers.index).post(isLoggedIn, validatePost, controllers.createPost)

router.get("/new", isLoggedIn, controllers.renderNewPostForm)

router.route("/:id").get(isLoggedIn, controllers.showPost).put(isLoggedIn, isOwner, validatePost, controllers.updatePost).delete(isLoggedIn, isOwner, controllers.destroyPost);
router.post("/:id/like",userCurrentPath, controllers.likePost);


router.get("/:id/edit", isLoggedIn, isOwner, controllers.renderEditForm)

module.exports = router;