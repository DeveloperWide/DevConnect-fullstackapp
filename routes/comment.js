const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateComment } = require("../middlewares");
const controllers = require("../controllers/comment")

//Create Comment 
router.post("/", validateComment, controllers.createComment);

router.delete("/:commentId", controllers.destroyComment);


module.exports = router;