module.exports = (app) => {
  const router = require("express").Router();
  const commentValidation = require("../validation/comment.validation");
  const commentsController = require("../controller/comments.controller");

  router
    .route("/")
    .get(commentsController.getAllComments)
    .post(commentValidation, commentsController.createComment);
  router
    .route("/:id")
    .get(commentsController.getOneCommentById)
    .put(commentValidation, commentsController.updateComment)
    .delete(commentsController.deleteComment);

  app.use("/api/comments", router);

  app.use((req, res) => {
    res.status(404).send({
      message: "URL Not Found",
      method: req.method,
      url: req.url,
    });
  });
};
