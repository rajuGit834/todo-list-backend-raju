module.exports = (app) => {
  const router = require("express").Router();
  const commentValidation = require("../validation/comment.validation");
  const commentsController = require("../controller/comments.controller");
  const validIdMiddleware = require("../middlewares/validIdMiddleware");

  router
    .route("/")
    .get(commentsController.getAllComments)
    .post(commentValidation, commentsController.createComment);
  router
    .route("/:id")
    .get(validIdMiddleware, commentsController.getOneCommentById)
    .put(commentValidation, commentsController.updateComment)
    .delete(validIdMiddleware, commentsController.deleteComment);

  app.use("/api/comments", router);

  app.use((req, res) => {
    res.status(404).send({
      message: "URL Not Found",
      method: req.method,
      url: req.url,
    });
  });
};
