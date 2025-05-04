const { postSchema, commentSchema } = require("./schema");
const ExpressError = require("./utility/ExpressError");

module.exports.validatePost = (req, res, next) => {
    let { error } = postSchema.validate(req.body);
    if (error) {
        throw new ExpressError(error.details[0].message, 400)
    } else {
        next();
    }
}


module.exports.validateComment = (req, res, next) => {
    let { error } = commentSchema.validate(req.body);
    if (error) {
        throw new ExpressError(error.details[0].message, 400)
    } else {
        next();
    }
}
